import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Validasi biar cuma domain Instagram/FB CDN yang boleh diproxy
  const allowedHosts = ["cdninstagram.com", "fbcdn.net"];
  const isAllowed = allowedHosts.some((host) => imageUrl.includes(host));
  if (!isAllowed) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  try {
    const res = await fetch(imageUrl, {
      headers: {
        // pura-pura jadi browser biasa, tanpa Referer
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: res.status }
      );
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // cache 1 hari
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy error" },
      { status: 500 }
    );
  }
}