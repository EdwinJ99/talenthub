import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import CreatorDetailClient from "./CreatorDetailClient";

const prisma = new PrismaClient();

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creatorId = Number(id);
  if (isNaN(creatorId)) return notFound();

  const creator = await prisma.mst_creators.findUnique({
    where: { id: creatorId },
  });

  if (!creator) return notFound();

  const topPosts = await prisma.dtl_creator_posts.findMany({
    where: { creator_id: creatorId },
    orderBy: { likes: "desc" },
    take: 5,
    select: {
      id: true,
      post_url: true,
      thumbnail_url: true,
      likes: true,
      comments: true,
      views: true,
    },
  });

  return (
    <CreatorDetailClient
      profile={{
        name: creator.name,
        username: creator.username,
        photoUrl: creator.photo_url,
        followers: creator.followers ?? 0,
        following: creator.following ?? null,
        engagementRate: Number(creator.engagement_rate ?? 0),
        socialMedia: creator.social_media,
      }}
      topPosts={topPosts.map((p) => ({
        id: p.id,
        postUrl: p.post_url,
        thumbnailUrl: p.thumbnail_url,
        likes: p.likes ?? 0,
        comments: p.comments ?? 0,
        views: p.views ?? 0,
      }))}
    />
  );
}