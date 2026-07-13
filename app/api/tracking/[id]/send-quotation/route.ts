import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idParam } = await params;
  const projectId = Number(idParam);
  if (!Number.isInteger(projectId)) {
    return NextResponse.json({ error: "ID project tidak valid" }, { status: 400 });
  }

  const [smtpUser, smtpPassword] = [
    process.env.SMTP_USER,
    process.env.SMTP_PASSWORD,
  ];

  if (!smtpUser || !smtpPassword) {
    return NextResponse.json(
      { error: "Konfigurasi SMTP belum tersedia di server" },
      { status: 500 }
    );
  }

  try {
    const project = await prisma.trs_project.findUnique({
      where: { prj_id: projectId },
      include: { mst_brand: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 });
    }

    const recipientEmail = project.mst_brand?.brd_email?.trim();
    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Email brand belum diisi" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const quotation = formData.get("quotation");
    if (!(quotation instanceof File) || quotation.size === 0) {
      return NextResponse.json({ error: "File PDF quotation wajib disertakan" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: (process.env.SMTP_SECURE ?? "true") === "true",
      auth: { user: smtpUser, pass: smtpPassword },
    });

    const brandName = escapeHtml(project.mst_brand?.brd_nama ?? "Partner");
    const projectName = escapeHtml(project.prj_nama);
    const quotationNumber = escapeHtml(project.prj_quotationno ?? project.prj_kode);
    const senderName = escapeHtml(session.user.name ?? "D'BEST Influence");

    await transporter.sendMail({
      from: `D'BEST Influence <${smtpUser}>`,
      to: recipientEmail,
      subject: `Quotation ${project.prj_kode} – ${project.prj_nama}`,
      text: `Yth. Tim ${project.mst_brand?.brd_nama ?? "Brand"},\n\nTerlampir quotation untuk project ${project.prj_nama} (${project.prj_kode}).\n\nSalam,\nD'BEST Influence`,
      html: `
        <div style="margin:0;padding:32px 16px;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1f2937">
          <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 18px rgba(15,23,42,.08)">
            <div style="padding:28px 36px;background:#111827;color:#ffffff">
              <div style="font-size:12px;letter-spacing:2px;font-weight:700;color:#d6b18a">D'BEST INFLUENCE</div>
              <div style="margin-top:10px;font-size:25px;font-weight:700">Quotation for Your Review</div>
            </div>
            <div style="padding:32px 36px;font-size:15px;line-height:1.65">
              <p style="margin-top:0">Yth. Tim <strong>${brandName}</strong>,</p>
              <p>Terima kasih atas kerja samanya. Bersama email ini kami lampirkan quotation untuk project berikut.</p>
              <table style="width:100%;border-collapse:collapse;margin:24px 0;background:#f9fafb">
                <tr><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280">Project</td><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-weight:700">${projectName}</td></tr>
                <tr><td style="padding:12px 16px;color:#6b7280">Quotation No.</td><td style="padding:12px 16px;font-weight:700">${quotationNumber}</td></tr>
              </table>
              <p>Silakan meninjau dokumen terlampir. Kami siap membantu bila ada pertanyaan atau penyesuaian yang diperlukan.</p>
              <p style="margin-bottom:0">Hormat kami,<br><strong>${senderName}</strong><br>D'BEST Influence</p>
            </div>
            <div style="padding:18px 36px;background:#f9fafb;color:#6b7280;font-size:12px;text-align:center">Email ini dikirim otomatis melalui TalentHub.</div>
          </div>
        </div>`,
      attachments: [
        {
          filename: quotation.name || `Quotation_${project.prj_kode}.pdf`,
          content: Buffer.from(await quotation.arrayBuffer()),
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ success: true, email: recipientEmail });
  } catch (error) {
    console.error("SEND QUOTATION EMAIL ERROR:", error);
    return NextResponse.json({ error: "Gagal mengirim email quotation" }, { status: 500 });
  }
}
