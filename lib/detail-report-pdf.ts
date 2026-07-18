import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type StoredReport = {
  caption: string | null;
  thumbnail_url: string | null;
  likes: number;
  comments: number;
  saves: number;
  reposts: number;
  views: number;
  plays: number;
  duration: number;
  shares: number;
  performance: number;
};

type ReportItem = {
  detailId: number;
  creatorName: string;
  username: string;
  platform: string;
  followers: number;
  sow: string | null;
  contentUrl: string | null;
  report: StoredReport | null;
};

export type DetailReportPayload = {
  project: { id: number; code: string; brand: string | null; name: string; pic: string; date: string | null };
  items: ReportItem[];
};

const NAVY: [number, number, number] = [25, 49, 61];
const GREEN: [number, number, number] = [73, 132, 108];
const MINT: [number, number, number] = [174, 211, 197];
const PINK: [number, number, number] = [235, 177, 180];
const ORANGE: [number, number, number] = [214, 143, 72];
const PAPER: [number, number, number] = [252, 252, 250];

function number(value: number) {
  return new Intl.NumberFormat('id-ID').format(value);
}

function username(value: string) {
  return `@${value.trim().replace(/^@+/, '')}`;
}

function title(doc: jsPDF, value: string, y = 30) {
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text(value, 18, y);
}

function decorations(doc: jsPDF) {
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  doc.setFillColor(...PAPER);
  doc.rect(0, 0, width, height, 'F');
  doc.setFillColor(...MINT);
  doc.ellipse(18, -5, 42, 24, 'F');
  doc.setFillColor(...PINK);
  doc.ellipse(width - 11, 8, 30, 18, 'F');
  doc.setFillColor(...ORANGE);
  doc.ellipse(8, height + 5, 25, 20, 'F');
  doc.setFillColor(222, 203, 202);
  doc.ellipse(width - 15, height + 2, 28, 22, 'F');
}

function footer(doc: jsPDF, page: number) {
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 125);
  doc.text('D\'BEST Influence · KOL Performance Report', 18, height - 7);
  doc.text(String(page), width - 18, height - 7, { align: 'right' });
}

function addPage(doc: jsPDF, page: number) {
  if (page > 1) doc.addPage();
  decorations(doc);
  footer(doc, page);
}

async function imageData(url: string | null): Promise<{ data: string; width: number; height: number } | null> {
  if (!url) return null;
  try {
    const response = await fetch(`/api/tracking/detail-report/thumbnail?url=${encodeURIComponent(url)}`);
    if (!response.ok) return null;
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    return await new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext('2d')?.drawImage(image, 0, 0);
        URL.revokeObjectURL(objectUrl);
        resolve({ data: canvas.toDataURL('image/jpeg', 0.88), width: image.naturalWidth, height: image.naturalHeight });
      };
      image.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(null); };
      image.src = objectUrl;
    });
  } catch {
    return null;
  }
}

function metricRows(item: ReportItem) {
  const report = item.report;
  if (!report) return [];
  return [
    ['Followers', item.followers], ['Views', report.views], ['Play', report.plays],
    ['Likes', report.likes], ['Comments', report.comments], ['Saves', report.saves],
    ['Shares', report.shares], ['Repost', report.reposts],
  ].filter((row): row is [string, number] => Number(row[1]) > 0);
}

function captionImage(value: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 1312;
  canvas.height = 400;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const padding = 36;
  const maxWidth = canvas.width - padding * 2;
  const lineHeight = 38;
  const maxLines = Math.floor((canvas.height - padding * 2) / lineHeight);
  context.fillStyle = '#f8f9f8';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#414f57';
  context.font = '26px Arial, "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  context.textBaseline = 'top';

  const lines: string[] = [];
  const paragraphs = value.replace(/\r\n/g, '\n').trim().split('\n');
  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      lines.push('');
      continue;
    }

    let current = '';
    for (const word of paragraph.trim().split(/\s+/u)) {
      if (context.measureText(word).width > maxWidth) {
        if (current) { lines.push(current); current = ''; }
        let chunk = '';
        for (const character of Array.from(word)) {
          if (context.measureText(chunk + character).width > maxWidth && chunk) {
            lines.push(chunk);
            chunk = character;
          } else {
            chunk += character;
          }
        }
        current = chunk;
        continue;
      }
      const candidate = current ? `${current} ${word}` : word;
      if (context.measureText(candidate).width <= maxWidth) {
        current = candidate;
        continue;
      }
      if (current) lines.push(current);
      current = word;
    }
    if (current) lines.push(current);
  }

  const visibleLines = lines.slice(0, maxLines);
  if (lines.length > maxLines && visibleLines.length) {
    let last = visibleLines[visibleLines.length - 1].replace(/[.\s]+$/u, '');
    while (last && context.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
    visibleLines[visibleLines.length - 1] = `${last}…`;
  }
  visibleLines.forEach((line, index) => context.fillText(line, padding, padding + index * lineHeight, maxWidth));
  return canvas.toDataURL('image/png');
}

export async function createDetailReportPdf(payload: DetailReportPayload) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const width = doc.internal.pageSize.getWidth();
  const reportItems = payload.items.filter((item) => item.report);
  let page = 1;

  addPage(doc, page);
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  const coverTitle = doc.splitTextToSize(`${String(payload.project.brand ?? 'Brand').toUpperCase()}\n${payload.project.name}\nKOL Report`, 230);
  doc.text(coverTitle, 18, 68);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Project ${payload.project.code}`, 18, 145);
  doc.text(`Prepared by ${payload.project.pic || "D'BEST Influence"}`, 18, 154);
  doc.setDrawColor(190, 150, 120);
  doc.setLineWidth(0.7);
  doc.circle(width - 52, 145, 18);
  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(151, 109, 80);
  doc.text("D'BEST", width - 52, 144, { align: 'center' });
  doc.setFont('times', 'italic');
  doc.setFontSize(8);
  doc.text('Influence', width - 52, 150, { align: 'center' });

  page++;
  addPage(doc, page);
  title(doc, 'Campaign Overview');
  const totalViews = reportItems.reduce((sum, item) => sum + (item.report?.views ?? 0), 0);
  const totalEngagement = reportItems.reduce((sum, item) => sum + (item.report?.likes ?? 0) +
    (item.report?.comments ?? 0) + (item.report?.saves ?? 0) + (item.report?.shares ?? 0) + (item.report?.reposts ?? 0), 0);
  const averagePerformance = reportItems.length
    ? reportItems.reduce((sum, item) => sum + (item.report?.performance ?? 0), 0) / reportItems.length : 0;
  doc.setFillColor(...GREEN);
  doc.circle(width / 2, 60, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(String(reportItems.length), width / 2, 63, { align: 'center' });
  autoTable(doc, {
    startY: 84,
    body: [
      ['Total Content', `${reportItems.length} posts`],
      ['Total Views', number(totalViews)],
      ['Total Engagement', number(totalEngagement)],
      ['Average Performance', `${averagePerformance.toFixed(2)}%`],
    ],
    theme: 'plain', margin: { left: 88, right: 88 },
    styles: { fontSize: 14, textColor: NAVY, cellPadding: 3, lineColor: [105, 121, 113], lineWidth: { bottom: 0.3 } },
    columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
  });

  page++;
  addPage(doc, page);
  title(doc, 'Campaign Performance Overview');
  autoTable(doc, {
    startY: 40,
    head: [['Creator', 'Platform', 'Followers', 'Views', 'Likes', 'Comments', 'Saves', 'Shares', 'Repost', 'ER']],
    body: reportItems.map((item) => [
      username(item.username), item.platform, number(item.followers), number(item.report?.views ?? 0),
      number(item.report?.likes ?? 0), number(item.report?.comments ?? 0), number(item.report?.saves ?? 0),
      number(item.report?.shares ?? 0), number(item.report?.reposts ?? 0), `${(item.report?.performance ?? 0).toFixed(2)}%`,
    ]),
    theme: 'grid', margin: { left: 8, right: 8 },
    headStyles: { fillColor: GREEN, textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 8 },
    bodyStyles: { textColor: NAVY, halign: 'center', fontSize: 8, lineColor: [102, 147, 128] },
  });

  for (const item of reportItems) {
    page++;
    addPage(doc, page);
    title(doc, username(item.username));
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(91, 108, 118);
    doc.text(`${item.creatorName} · ${item.platform}${item.sow ? ` · ${item.sow}` : ''}`, 19, 38);

    const thumbnail = await imageData(item.report?.thumbnail_url ?? null);
    doc.setFillColor(241, 245, 244);
    doc.roundedRect(18, 46, 78, 132, 3, 3, 'F');
    if (thumbnail) {
      const maxWidth = 72;
      const maxHeight = 126;
      const scale = Math.min(maxWidth / thumbnail.width, maxHeight / thumbnail.height);
      const imageWidth = thumbnail.width * scale;
      const imageHeight = thumbnail.height * scale;
      const imageX = 21 + (maxWidth - imageWidth) / 2;
      const imageY = 49 + (maxHeight - imageHeight) / 2;
      try { doc.addImage(thumbnail.data, 'JPEG', imageX, imageY, imageWidth, imageHeight, undefined, 'FAST'); } catch { /* fallback panel remains */ }
    } else {
      doc.setTextColor(135, 149, 156);
      doc.setFontSize(11);
      doc.text('Thumbnail unavailable', 57, 111, { align: 'center' });
    }

    doc.setTextColor(...NAVY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Content Performance', 109, 51);
    const metrics = metricRows(item);
    metrics.forEach(([label, value], index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const x = 109 + col * 42;
      const y = 60 + row * 29;
      doc.setFillColor(246, 248, 247);
      doc.roundedRect(x, y, 38, 23, 2, 2, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(95, 112, 121);
      doc.text(label, x + 3, y + 7);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...NAVY);
      doc.text(number(value), x + 3, y + 16);
    });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Caption', 109, 126);
    doc.setFillColor(248, 249, 248);
    doc.roundedRect(109, 130, 164, 50, 2, 2, 'F');
    const renderedCaption = captionImage(item.report?.caption || '-');
    if (renderedCaption) doc.addImage(renderedCaption, 'PNG', 109, 130, 164, 50, undefined, 'FAST');
  }

  return doc;
}

export async function exportDetailReportPdf(payload: DetailReportPayload) {
  const doc = await createDetailReportPdf(payload);
  const safeName = `${payload.project.brand ?? 'Brand'}_${payload.project.name}_KOL_Report`
    .replace(/[^a-z0-9_-]+/gi, '_');
  doc.save(`${safeName}.pdf`);
}
