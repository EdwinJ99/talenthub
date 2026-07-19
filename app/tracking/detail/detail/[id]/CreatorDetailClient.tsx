"use client";

import DefaultLayout from "@/components/Layout/DefaultLayout";

type Profile = {
  name: string;
  username: string;
  photoUrl: string | null;
  followers: number;
  following: number | null;
  engagementRate: number;
  socialMedia: string;
};

type Post = {
  id: number;
  postUrl: string | null;
  thumbnailUrl: string | null;
  likes: number;
  comments: number;
  views: number;
};

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function PostCard(props: { post: Post }) {
  const post = props.post;
  const imageUrl = post.thumbnailUrl
    ? "/api/image-proxy?url=" + encodeURIComponent(post.thumbnailUrl)
    : "";
  const linkHref = post.postUrl ? post.postUrl : "#";

  return (
    <a
      href={linkHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative h-60 w-full overflow-hidden rounded-lg bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-slate-300">
            photo
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/40">
          <span className="text-sm font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Lihat Post
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm font-semibold text-slate-600">
        <span>Likes: {formatNumber(post.likes)}</span>
        <span>Comments: {formatNumber(post.comments)}</span>
        <span>Views: {formatNumber(post.views)}</span>
      </div>
    </a>
  );
}

function EmptyStateCard(props: { title: string; height?: string }) {
  const height = props.height ? props.height : "h-60";
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <h3 className="mb-4 font-bold">{props.title}</h3>
      <div
        className={
          height +
          " flex flex-col items-center justify-center gap-2 rounded-lg bg-slate-50 text-slate-400"
        }
      >
        <span className="text-3xl">--</span>
        <span className="text-sm italic">Belum ada data</span>
      </div>
    </div>
  );
}

export default function CreatorDetailClient(props: {
  profile: Profile;
  topPosts: Post[];
}) {
  const profile = props.profile;
  const topPosts = props.topPosts;

  const photoSrc = profile.photoUrl
    ? "/api/image-proxy?url=" + encodeURIComponent(profile.photoUrl)
    : "https://picsum.photos/200";

  const followingText =
    profile.following !== null ? formatNumber(profile.following) : "-";

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={photoSrc}
                alt={profile.name}
                className="h-16 w-16 rounded-full object-cover sm:h-24 sm:w-24"
              />
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-slate-500">@{profile.username}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400">ENGAGEMENT RATE</p>
              <p className="mt-2 text-2xl font-bold">
                {profile.engagementRate.toFixed(1)}%
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">FOLLOWERS</p>
              <p className="mt-2 text-2xl font-bold">
                {formatNumber(profile.followers)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">FOLLOWING</p>
              <p className="mt-2 text-2xl font-bold">{followingText}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8">
          <h2 className="mb-6 text-2xl font-bold">Engagement</h2>
          <div className="grid gap-6 xl:grid-cols-3">
            <EmptyStateCard title="User Authenticity" />
            <EmptyStateCard title="Gender" />
            <EmptyStateCard title="Followers Reachability" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8">
          <h2 className="mb-6 text-2xl font-bold">Audience Breakdown</h2>
          <div className="grid gap-6 xl:grid-cols-2">
            <EmptyStateCard title="Top 5 City" />
            <EmptyStateCard title="Age Range" />
            <div className="xl:col-span-2">
              <EmptyStateCard title="Profile Growth - Last 6 Months" height="h-72" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8">
          <h2 className="mb-6 text-2xl font-bold">Content</h2>

          <div className="grid gap-6 xl:grid-cols-3">
            <EmptyStateCard title="Top 10 Hashtags" height="h-40" />
            <EmptyStateCard title="Top 5 Mentions" height="h-40" />
            <EmptyStateCard title="Top 2 Interests" height="h-40" />
          </div>

          <div className="mt-10">
            <h3 className="mb-5 text-xl font-bold">Top 5 Contents</h3>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {topPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {topPosts.length === 0 ? (
                <p className="col-span-full py-8 text-center italic text-slate-400">
                  Belum ada data postingan untuk creator ini.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}