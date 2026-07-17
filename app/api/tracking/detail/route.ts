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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    const projectId = Number(searchParams.get("projectId"));

    if (isNaN(projectId)) {
      return NextResponse.json(
        {
          error: "Invalid Project ID",
        },
        { status: 400 }
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
        ...item, // pass all original fields
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
        sow: item.mst_sow?.sow_nama,

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
        error: "Failed to fetch project details",
      },
      { status: 500 }
    );
  }
}

// ================= PATCH for detail project =================
export async function PATCH(req: Request) {
  const session = await authorize();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await req.json();

    if (body.drf_sow !== undefined && body.drf_sow !== null) {
      const sowId = Number(body.drf_sow);

      if (!Number.isInteger(sowId)) {
        return NextResponse.json({ error: "Invalid SOW" }, { status: 400 });
      }

      const sow = await prisma.mst_sow.findUnique({
        where: { sow_id: sowId },
      });

      if (!sow) {
        return NextResponse.json({ error: "SOW was not found" }, { status: 404 });
      }
    }

    const dataToUpdate: {
      drf_sow?: number | null;
      drf_planning_upload?: Date | null;
      drf_actual_upload?: Date | null;
      drf_link_content?: string | null;
      modiby: string;
      modidate: Date;
    } = {
      modiby: session.user.name ?? "admin",
      modidate: new Date(),
    };

    if (body.drf_sow !== undefined) {
      dataToUpdate.drf_sow = body.drf_sow === null || body.drf_sow === ""
        ? null
        : Number(body.drf_sow);
    }

    if (body.drf_planning_upload !== undefined) {
      dataToUpdate.drf_planning_upload = body.drf_planning_upload
        ? new Date(body.drf_planning_upload)
        : null;
    }

    if (body.drf_actual_upload !== undefined) {
      dataToUpdate.drf_actual_upload = body.drf_actual_upload
        ? new Date(body.drf_actual_upload)
        : null;
    }

    if (body.drf_link_content !== undefined) {
      dataToUpdate.drf_link_content = body.drf_link_content;
    }

    const updatedCreator = await prisma.dtl_project.update({
      where: { drf_id: id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedCreator);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  const session = await authorize();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);

    const id = Number(searchParams.get("id"));

    if (isNaN(id)) {
      return NextResponse.json(
        {
          error: "Invalid ID",
        },
        { status: 400 }
      );
    }

    await prisma.dtl_project.delete({
      where: {
        drf_id: id,
      },
    });

    return NextResponse.json({
      message: "Creator has been successfully removed from the project",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete creator",
      },
      { status: 500 }
    );
  }
}

// POST and PUT handlers from your provided code can be added here if needed.
// For this specific task, they are not directly involved in the error.
