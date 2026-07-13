import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next"; // Ambil session dari NextAuth
import { authOptions } from "@/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 1. Ambil session user yang sedang login
    const session = await getServerSession(authOptions);
    
    // Jika tidak ada session (belum login), default ke "SYSTEM" atau lempar error 401
    const usernameLogin = session?.user?.name || session?.user?.email || "SYSTEM";

    const body = await request.json();
    const { projectName, brandId, startDate, endDate, selectedCreators } = body;

    // 2. Validasi Input Dasar
    if (!projectName || !brandId || !startDate || !endDate || !selectedCreators || selectedCreators.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Jalankan Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      
      // Langkah A: Insert ke tabel trs_project
      const prjKode = `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newProject = await tx.trs_project.create({
        data: {
          prj_kode: prjKode,
          prj_brand: parseInt(brandId),
          prj_nama: projectName,
          prj_dstartdate: new Date(startDate),
          prj_denddate: new Date(endDate),
          prj_status: 1, 
          creaby: usernameLogin, // Menggunakan user yang login
          creadate: new Date(),
        },
      });

      // Langkah B: Siapkan list data untuk tabel dtl_project
      // Memetakan id asli milik creator ke kolom drf_creatorid
      const detailData = selectedCreators.map((creator: any) => {
        // Ambil ID database asli milik creator (biasanya creator.id)
        const creatorDatabaseId = creator.id; 

        if (!creatorDatabaseId) {
          throw new Error(`Creator ${creator.name || ''} tidak memiliki ID database yang valid.`);
        }

        return {
          drf_projectid: newProject.prj_id, // Foreign key ke trs_project
          drf_creatorid: parseInt(creatorDatabaseId), // ID creator yang di-select dari tabel mst_creators
          drf_sow: 1, // Default SOW awal
          drf_qty: 1, // Default Qty
          drf_rate: 0, // Default Rate awal
          drf_status: 0, // Default status draft sesuai skema (DEFAULT 0)
          creaby: usernameLogin, // Menggunakan user yang login
          creadate: new Date(),
        };
      });

      // Langkah C: Bulk Insert ke tabel dtl_project
      // Kolom drf_id tidak dimasukkan karena sudah auto-increment sequence di PostgreSQL
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