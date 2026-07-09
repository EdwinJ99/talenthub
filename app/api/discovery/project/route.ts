import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectName, brandId, startDate, endDate, selectedCreators } = body;

    // 1. Validasi Input Dasar
    if (!projectName || !brandId || !startDate || !endDate || !selectedCreators || selectedCreators.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Jalankan Prisma Transaction agar penyimpanan ke 2 tabel aman (atomic)
    const result = await prisma.$transaction(async (tx) => {
      
      // Langkah A: Insert ke tabel trs_project
      // Catatan: prj_id tidak perlu dimasukkan karena sudah autoincrement()
      const prjKode = `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`; // Contoh generate kode simple
      
      const newProject = await tx.trs_project.create({
        data: {
          prj_kode: prjKode,
          prj_brand: parseInt(brandId),
          prj_nama: projectName,
          prj_dstartdate: new Date(startDate),
          prj_denddate: new Date(endDate),
          prj_status: 1, // Default status aktif/draft
          creaby: "SYSTEM", 
          creadate: new Date(),
        },
      });

      // Langkah B: Siapkan list data untuk tabel dtl_project
      // Hanya memasukkan field yang terdaftar di skema dtl_project baru kamu
      const detailData = selectedCreators.map((creator: any) => {
        return {
          drf_projectid: newProject.prj_id, // Mengambil ID dari project yang baru saja ter-insert otomatis di atas
          drf_creatorid: creator.creatorId || creator.id || 1, // Pastikan dapat ID dari front-end
          drf_sow: 1, // Sesuai master mst_sow kamu (misal: 1)
          drf_qty: 1, // Default qty, sesuaikan jika ada input qty dari UI
          drf_rate: 0, // Default rate/harga, sesuaikan jika ada input budget dari UI
          creaby: "SYSTEM",
          creadate: new Date(),
        };
      });

      // Langkah C: Bulk Insert ke tabel dtl_project
      await tx.dtl_project.createMany({
        data: detailData,
      });

      return newProject;
    });

    return NextResponse.json({ success: true, project: result });

  } catch (error) {
    console.error("Failed to save project and details:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}