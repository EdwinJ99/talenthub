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

    // 2. Generate ID Baru untuk prj_id (karena prj_id tidak berwujud Serial/Autoincrement di DDL Anda)
    const maxProject = await prisma.trs_project.findFirst({
      orderBy: { prj_id: "desc" },
      select: { prj_id: true }
    });
    const nextPrjId = maxProject ? maxProject.prj_id + 1 : 1;

    // 3. Jalankan Prisma Transaction agar penyimpanan ke 2 tabel aman (atomic)
    const result = await prisma.$transaction(async (tx) => {
      
      // Langkah A: Insert ke tabel trs_project
      const newProject = await tx.trs_project.create({
        data: {
          prj_id: nextPrjId,
          prj_brand: parseInt(brandId),
          prj_nama: projectName,
          prj_dstartdate: new Date(startDate),
          prj_denddate: new Date(endDate),
          prj_status: 1, // Default status aktif/draft
          creaby: "SYSTEM", // Sesuaikan dengan session user nanti
          creadate: new Date(),
        },
      });

      // Langkah B: Siapkan list data KOL untuk tabel dtl_project
      // Catatan: Pastikan properti KOL dari front-end disesuaikan dengan skema database Anda
      const detailData = selectedCreators.map((creator: any) => ({
        drf_projectid: nextPrjId,
        drf_sow: 1, // Berikan default SOW ID (sesuai isi master mst_sow Anda, misal: 1)
        drf_username: creator.username || "",
        drf_nama: creator.name || "",
        drf_totalpost: creator.post ? parseInt(creator.post) : 0,
        drf_followers: creator.followersRaw ? parseInt(creator.followersRaw) : 0,
        drf_er: creator.er ? parseFloat(creator.er) : 0.0,
        drf_avgviewall: creator.avrView ? parseInt(creator.avrView) : 0,
        drf_avgviewbrand: creator.avrBrand ? parseInt(creator.avrBrand) : 0,
        drf_cpvall: creator.cpvAll ? parseInt(creator.cpvAll) : 0,
        drf_cpvallbrand: creator.cpvBranded ? parseInt(creator.cpvBranded) : 0,
        drf_platform: creator.social_media || "Instagram",
        creaby: "SYSTEM",
      }));

      // Langkah C: Bulk Insert ke tabel dtl_project
      await tx.dtl_project.createMany({
        data: detailData,
      });

      return newProject;
    });

    return NextResponse.json({ success: true, project: result });

  } catch (error) {
    console.error("Failed to save project and details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


