"use client";

import { useMemo, useState } from "react";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import {
  computeInsightsFromPosts,
  filterPostsByRange,
  type RawPostLike,
} from "@/lib/insights";

type Profile = {
  name: string;
  username: string;
  photoUrl: string | null;
  followers: number;
  following: number | null;
  socialMedia: string;
  totalPost: number;
  lastScrapedAt: string | null;
};

type Post = RawPostLike & { id: number };

type RangeDays = 7 | 30 | 60 | 90;

const RANGE_OPTIONS: { label: string; value: RangeDays }[] = [
  { label: "Last 7 Days", value: 7 },
  { label: "Last 30 Days", value: 30 },
  { label: "Last 60 Days", value: 60 },
  { label: "Last 90 Days", value: 90 },
];

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "numeric", year: "numeric" });
}

function proxied(url?: string | null): string {
  return url ? "/api/image-proxy?url=" + encodeURIComponent(url) : "";
}

function MetricCard(props: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className={"flex h-11 w-11 items-center justify-center rounded-lg " + props.iconBg}>
        {props.icon}
      </div>
      <div>
        <p className="text-xs font-medium tracking-wide text-slate-400">
          {props.label.toUpperCase()}
        </p>
        <p className="mt-1 text-xl font-bold text-slate-800">{props.value}</p>
      </div>
    </div>
  );
}

export default function CreatorDetailClient(props: { profile: Profile; posts: Post[] }) {
  const { profile, posts } = props;
  const [range, setRange] = useState<RangeDays>(90);

  const photoSrc = proxied(profile.photoUrl) || "https://picsum.photos/200";
  const followingText = profile.following !== null ? formatNumber(profile.following) : "-";

  // Recomputed entirely client-side from the posts already fetched by the
  // server — clicking a range tab doesn't refetch or re-scrape anything.
  const insights = useMemo(() => {
    const filtered = filterPostsByRange(posts, range);
    return computeInsightsFromPosts(filtered, profile.followers, profile.totalPost);
  }, [posts, range, profile.followers, profile.totalPost]);

  const lastPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
      .slice(0, 5);
  }, [posts]);

  return (
    <DefaultLayout>
      <div className="space-y-6">
        {/* Profile card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="h-24 bg-[#E3A458]" />
          <div className="px-6 pb-6">
            <img
              src={photoSrc}
              alt={profile.name}
              className="-mt-10 h-20 w-20 rounded-2xl border-4 border-white object-cover"
            />
            <h1 className="mt-3 text-xl font-bold text-slate-800">{profile.name}</h1>
            <p className="text-sm text-slate-500">
              @{profile.username}{" "}
              <span className="text-xs uppercase text-slate-400">
                · {profile.socialMedia}
              </span>
            </p>

            <div className="mt-4 flex gap-6 text-sm">
              <span className="text-slate-400">
                FOLLOWERS{" "}
                <span className="font-bold text-slate-800">
                  {formatNumber(profile.followers)}
                </span>
              </span>
              <span className="text-slate-400">
                FOLLOWING{" "}
                <span className="font-bold text-slate-800">{followingText}</span>
              </span>
            </div>
          </div>
        </section>

        {/* User Performance */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-800">User Performance</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRange(opt.value)}
                className={
                  "rounded-full px-4 py-1.5 text-sm font-semibold " +
                  (range === opt.value
                    ? "bg-sky-600 text-white"
                    : "border border-slate-200 text-slate-500 hover:bg-slate-50")
                }
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              label="Total Posts"
              value={insights.totalPosts.toLocaleString()}
              iconBg="bg-indigo-50"
              icon={<span className="text-indigo-500">👥</span>}
            />
            <MetricCard
              label="Avg Likes"
              value={formatNumber(insights.avgLikes)}
              iconBg="bg-rose-50"
              icon={<span className="text-rose-500">❤</span>}
            />
            <MetricCard
              label="Avg Comments"
              value={formatNumber(insights.avgComments)}
              iconBg="bg-emerald-50"
              icon={<span className="text-emerald-500">💬</span>}
            />
            <MetricCard
              label="Avg Views"
              value={formatNumber(insights.avgViews)}
              iconBg="bg-sky-50"
              icon={<span className="text-sky-500">👁</span>}
            />
            <MetricCard
              label="Engagement Rate"
              value={insights.engagementRate.toFixed(2) + "%"}
              iconBg="bg-teal-50"
              icon={<span className="text-teal-500">📈</span>}
            />
            <MetricCard
              label="Days Tracked"
              value={String(range)}
              iconBg="bg-orange-50"
              icon={<span className="text-orange-500">🎯</span>}
            />
          </div>
        </section>

        {/* Analytics Insights + Last Posts Insight */}
        <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              📊 Analytics Insights
            </h2>

            <p className="mt-4 text-xs font-semibold tracking-wide text-slate-400">
              TOP HASHTAGS
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {insights.topHashtags.length > 0 ? (
                insights.topHashtags.map((h) => (
                  <span
                    key={h.tag}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                  >
                    #{h.tag}
                  </span>
                ))
              ) : (
                <span className="text-sm italic text-slate-400">Belum ada data</span>
              )}
            </div>

            <p className="mt-5 text-xs font-semibold tracking-wide text-slate-400">
              TOP MENTIONS
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {insights.topMentions.length > 0 ? (
                insights.topMentions.map((m) => (
                  <span
                    key={m.mention}
                    className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600"
                  >
                    @{m.mention}
                  </span>
                ))
              ) : (
                <span className="text-sm italic text-slate-400">Belum ada data</span>
              )}
            </div>

            {profile.lastScrapedAt ? (
              <p className="mt-6 flex items-center gap-1 text-xs text-emerald-500">
                ✓ Last Updated: {formatDate(profile.lastScrapedAt)}
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-800">Last Posts Insight</h2>

            <div className="mt-4 space-y-4">
              {lastPosts.length > 0 ? (
                lastPosts.map((post) => (
                  <a
                    key={post.id}
                    href={post.postUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg p-1 hover:bg-slate-50"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {post.thumbnailUrl ? (
                        <img
                          src={proxied(post.thumbnailUrl)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="text-sm">
                      <p className="flex items-center gap-1 font-semibold text-slate-700">
                        ❤ {formatNumber(post.likes)} Likes
                      </p>
                      <p className="flex items-center gap-1 text-slate-500">
                        💬 {formatNumber(post.comments)} Comments
                      </p>
                    </div>
                  </a>
                ))
              ) : (
                <p className="py-6 text-center text-sm italic text-slate-400">
                  Belum ada data postingan.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </DefaultLayout>
  );
}