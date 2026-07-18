import { authOptions } from '@/auth';
import { scrapeContentUrl } from '@/lib/apify';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

async function authorized() {
  return Boolean((await getServerSession(authOptions))?.user);
}

function parseIds(values: string[]): number[] {
  return [...new Set(values.flatMap((value) => value.split(',')).map(Number))]
    .filter((id) => Number.isInteger(id) && id > 0);
}

async function getRows(projectId: number, detailIds: number[]) {
  return prisma.dtl_project.findMany({
    where: {
      drf_projectid: projectId,
      ...(detailIds.length ? { drf_id: { in: detailIds } } : {}),
    },
    include: { mst_creators: true, mst_sow: true, detail_report: true },
    orderBy: { drf_id: 'asc' },
  });
}

function serialize(row: Awaited<ReturnType<typeof getRows>>[number]) {
  return {
    detailId: row.drf_id,
    creatorId: row.drf_creatorid,
    creatorName: row.mst_creators.name,
    username: row.mst_creators.username,
    platform: row.mst_creators.social_media,
    photo: row.mst_creators.photo_url,
    sow: row.mst_sow?.sow_nama ?? null,
    contentUrl: row.drf_link_content,
    report: row.detail_report,
  };
}

export async function GET(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const projectId = Number(params.get('projectId'));
  const detailIds = parseIds(params.getAll('detailIds'));
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
  }

  const [project, rows] = await Promise.all([
    prisma.trs_project.findUnique({
      where: { prj_id: projectId },
      include: { mst_brand: true },
    }),
    getRows(projectId, detailIds),
  ]);
  if (!project) return NextResponse.json({ error: 'Project was not found' }, { status: 404 });

  return NextResponse.json({
    project: {
      id: project.prj_id, brand: project.mst_brand.brd_nama,
      name: project.prj_nama, pic: project.creaby, date: project.prj_renddate,
    },
    items: rows.map(serialize),
  });
}

export async function POST(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null) as { projectId?: unknown; detailIds?: unknown } | null;
  const projectId = Number(body?.projectId);
  const detailIds = Array.isArray(body?.detailIds)
    ? parseIds(body.detailIds.map(String))
    : [];
  if (!Number.isInteger(projectId) || projectId <= 0 || detailIds.length === 0) {
    return NextResponse.json({ error: 'Project ID and selected creators are required' }, { status: 400 });
  }

  const rows = await getRows(projectId, detailIds);
  const results = await Promise.all(rows.map(async (row) => {
    if (!row.drf_link_content) return { detailId: row.drf_id, error: 'URL content is empty' };
    try {
      const metric = await scrapeContentUrl(row.drf_link_content);
      const interactions = metric.likes + metric.comments + metric.saves + metric.reposts + metric.shares;
      const performance = metric.views > 0 ? (interactions / metric.views) * 100 : 0;
      await prisma.detail_report.upsert({
        where: { dtl_project_id: row.drf_id },
        update: {
          content_url: metric.contentUrl, platform: metric.platform, caption: metric.caption,
          thumbnail_url: metric.thumbnailUrl, likes: metric.likes, comments: metric.comments,
          saves: metric.saves, reposts: metric.reposts, views: metric.views, plays: metric.plays,
          duration: metric.duration, shares: metric.shares, performance, scraped_at: new Date(),
        },
        create: {
          dtl_project_id: row.drf_id, content_url: metric.contentUrl, platform: metric.platform,
          caption: metric.caption, thumbnail_url: metric.thumbnailUrl, likes: metric.likes,
          comments: metric.comments, saves: metric.saves, reposts: metric.reposts,
          views: metric.views, plays: metric.plays, duration: metric.duration,
          shares: metric.shares, performance,
        },
      });
      return { detailId: row.drf_id, success: true };
    } catch (error) {
      console.error(`Detail report scraping failed for detail ${row.drf_id}:`, error);
      const message = error instanceof Error ? error.message : 'Scraping failed';
      const isDatabaseError = message.includes('prisma') || message.includes('Invalid value provided');
      return { detailId: row.drf_id, error: isDatabaseError ? 'Scraped metadata could not be saved' : message };
    }
  }));

  const refreshed = await getRows(projectId, detailIds);
  return NextResponse.json({ items: refreshed.map(serialize), results }, {
    status: results.some((result) => 'error' in result) ? 207 : 200,
  });
}
