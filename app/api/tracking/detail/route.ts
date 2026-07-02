import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function authorize() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return session;
}

// ================= GET =================
export async function GET(request: Request) {
  const session = await authorize();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    const projectId = Number(searchParams.get("projectId"));

    if (isNaN(projectId)) {
      return NextResponse.json(
        {
          error: "Project ID tidak valid",
        },
        {
          status: 400,
        }
      );
    }

    const details = await prisma.dtl_project.findMany({
      where: {
        drf_projectid: projectId,
      },
      include: {
        mst_creators: true,
        mst_sow: true,
      },
      orderBy: {
        drf_id: "asc",
      },
    });

    const subtotal = details.reduce(
  (sum, item) => sum + Number(item.drf_rate) * Number(item.drf_qty),
  0
);

const dpp = subtotal;
const ppn = dpp * 0.11;
const grandTotal = dpp + ppn;

return NextResponse.json({
  creators: details.map((item) => ({
    id: item.drf_id,

    creatorId: item.drf_creatorid,
    name: item.mst_creators.name,
    username: item.mst_creators.username,
    photo: item.mst_creators.photo_url,

    platform: item.mst_creators.social_media,
    tier: item.mst_creators.tier,
    gender: item.mst_creators.gender,

    followers: item.mst_creators.followers,
    totalPost: item.mst_creators.total_post,

    engagementRate: Number(item.mst_creators.engagement_rate),

    averageView: item.mst_creators.average_view,
    averageViewBrand: item.mst_creators.average_view_brand,

    cpvAll: Number(item.mst_creators.cpv_all),
    cpvBranded: Number(item.mst_creators.cpv_branded),

    sowId: item.drf_sow,
    sow: item.mst_sow.sow_nama,

    qty: item.drf_qty,
    rate: Number(item.drf_rate),

    total: Number(item.drf_rate) * Number(item.drf_qty),
  })),

  subtotal,
  dpp,
  ppn,
  grandTotal,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal mengambil detail project",
      },
      {
        status: 500,
      }
    );
  }
}

// ================= POST =================
export async function POST(request: Request) {
  const session = await authorize();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const creator = await prisma.mst_creators.findUnique({
      where: {
        id: Number(body.creatorId),
      },
    });

    if (!creator) {
      return NextResponse.json(
        {
          error: "Creator tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    const detail = await prisma.dtl_project.create({
      data: {
        drf_projectid: Number(body.projectId),
        drf_creatorid: Number(body.creatorId),
        drf_sow: Number(body.sowId),

        drf_qty: Number(body.qty),

        drf_rate: Number(creator.cpv_branded ?? 0),

        creaby: session.user.name ?? "admin",
        creadate: new Date(),
      },
    });

    return NextResponse.json({
      message: "Creator berhasil ditambahkan",
      data: detail,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal menambah creator",
      },
      {
        status: 500,
      }
    );
  }
}

// ================= PUT =================
export async function PUT(request: Request) {
  const session = await authorize();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    const id = Number(searchParams.get("id"));

    if (isNaN(id)) {
      return NextResponse.json(
        {
          error: "ID tidak valid",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const detail = await prisma.dtl_project.update({
      where: {
        drf_id: id,
      },
      data: {
        drf_sow: Number(body.sowId),
        drf_qty: Number(body.qty),
        drf_creatorid: Number(body.creatorId),

        modiby: session.user.name ?? "admin",
        modidate: new Date(),
      },
    });

    return NextResponse.json({
      message: "Detail project berhasil diperbarui",
      data: detail,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal update detail project",
      },
      {
        status: 500,
      }
    );
  }
}

// ================= DELETE =================
export async function DELETE(request: Request) {
  const session = await authorize();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    const id = Number(searchParams.get("id"));

    if (isNaN(id)) {
      return NextResponse.json(
        {
          error: "ID tidak valid",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.dtl_project.delete({
      where: {
        drf_id: id,
      },
    });

    return NextResponse.json({
      message: "Creator berhasil dihapus dari project",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal menghapus creator",
      },
      {
        status: 500,
      }
    );
  }
}