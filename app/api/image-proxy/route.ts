import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Validasi domain: Instagram/FB CDN + TikTok CDN
  const allowedHosts = [
    "cdninstagram.com",
    "fbcdn.net",
    "tiktokcdn.com",
    "tiktokcdn-us.com",
    "ibyteimg.com",
  ];
  const isAllowed = allowedHosts.some((host) => imageUrl.includes(host));
  if (!isAllowed) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: imageUrl.includes("tiktok")
          ? "https://www.tiktok.com/"
          : "https://www.instagram.com/",
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
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy error" },
      { status: 500 }
    );
  }
}