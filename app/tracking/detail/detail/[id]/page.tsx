"use client";

import DefaultLayout from "@/components/Layout/DefaultLayout";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#ec4899",
  "#14b8a6",
  "#22c55e",
  "#f59e0b",
];

const authenticityData = [
  { name: "Real", value: 70 },
  { name: "Suspicious", value: 15 },
  { name: "Mass Followers", value: 10 },
  { name: "Influencers", value: 5 },
];

const genderData = [
  { name: "Female", value: 80 },
  { name: "Male", value: 20 },
];

const reachabilityData = [
  { name: "<500", value: 55 },
  { name: "500-1000", value: 25 },
  { name: "1000-1500", value: 10 },
  { name: "1500+", value: 10 },
];

const cityData = [
  { month: "Jakarta", value: 45 },
  { month: "Bekasi", value: 20 },
  { month: "Bandung", value: 15 },
  { month: "Bogor", value: 12 },
  { month: "Depok", value: 8 },
];

const ageData = [
  { month: "13-17", value: 10 },
  { month: "18-24", value: 40 },
  { month: "25-34", value: 35 },
  { month: "35-44", value: 10 },
  { month: "45+", value: 5 },
];

const growthData = [
  { month: "Jan", value: 10.8 },
  { month: "Feb", value: 11.1 },
  { month: "Mar", value: 11.3 },
  { month: "Apr", value: 11.7 },
  { month: "May", value: 12.0 },
  { month: "Jun", value: 12.5 },
];

const hashtags = [
  "#iontahanbocor",
  "#dinginkankepalasejukkanhati",
  "#lanjutterus",
  "#mlbb8th",
  "#hut128bri",
  "#kuatdanhebat",
  "#kesenangantanpabatas",
];

const mentions = [
  "@pocariid",
  "@yislamaljaidi",
  "@fadiljaidi",
  "@clarissaputri_",
  "@sandradlubis",
];

const interests = [
  {
    name: "Friends, Family & Relationships",
    value: 28,
  },
  {
    name: "Clothes, Shoes, Handbags & Accessories",
    value: 22,
  },
];

const topContents = [
  {
    image: "https://picsum.photos/250/300?1",
    likes: "2510752",
    comments: "29029",
  },
  {
    image: "https://picsum.photos/250/300?2",
    likes: "10641",
    comments: "2408464",
  },
  {
    image: "https://picsum.photos/250/300?3",
    likes: "2253484",
    comments: "6783",
  },
  {
    image: "https://picsum.photos/250/300?4",
    likes: "2191881",
    comments: "18542",
  },
  {
    image: "https://picsum.photos/250/300?5",
    likes: "2113918",
    comments: "32832",
  },
];

export default function DetailCreatorPage() {
  return (
    <DefaultLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <img
                  src="https://picsum.photos/200"
                  alt=""
                  className="h-24 w-24 rounded-full object-cover"
                />

              <div>
                <h1 className="text-2xl font-bold">
                  Fadil Jaidi
                </h1>

                <p className="text-slate-500">
                  @fadiljaidi
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                ENGAGEMENT RATE
              </p>

              <p className="mt-2 text-2xl font-bold">
                4.9%
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                FOLLOWERS
              </p>

              <p className="mt-2 text-2xl font-bold">
                12.5M
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                FOLLOWING
              </p>

              <p className="mt-2 text-2xl font-bold">
                1329
              </p>
            </div>
          </div>
        </section>

        {/* USER PERFORMANCE */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="mb-6 text-2xl font-bold">
            User Performance
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            <StatCard title="AVG. LIKES" value="614.229" />
            <StatCard title="AVG. COMMENTS" value="6.138" />
            <StatCard title="AVG. REELS" value="11.750.996" />
          </div>
        </section>

        {/* ENGAGEMENT */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="mb-6 text-2xl font-bold">
            Engagement
          </h2>

          <div className="grid gap-6 xl:grid-cols-3">
            <PieChartCard
              title="User Authenticity"
              data={authenticityData}
            />

            <PieChartCard
              title="Gender"
              data={genderData}
            />

            <PieChartCard
              title="Followers Reachability"
              data={reachabilityData}
            />
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="mb-6 text-2xl font-bold">
            Audience Breakdown
          </h2>

          <div className="grid gap-6 xl:grid-cols-2">

            <LineChartCard
              title="Top 5 City"
              data={cityData}
            />

            <LineChartCard
              title="Age Range"
              data={ageData}
            />

            <div className="xl:col-span-2">
              <LineChartCard
                title="Profile Growth - Last 6 Months"
                data={growthData}
              />
            </div>

          </div>
        </section>

        {/* CONTENT */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="mb-6 text-2xl font-bold">
            Content
          </h2>

          <div className="grid gap-6 xl:grid-cols-3">

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="mb-4 text-lg font-bold">
                Top 10 Hashtags
              </h3>

              <div className="space-y-2 text-sm text-blue-700">
                {hashtags.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <h3 className="mb-4 text-lg font-bold">
                Top 5 Mentions
              </h3>

              <div className="space-y-2 text-sm text-blue-700">
                {mentions.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <h3 className="mb-4 text-lg font-bold">
                Top 2 Interests
              </h3>

              <div className="space-y-5">
                {interests.map((item) => (
                  <div key={item.name}>
                    <div className="mb-1 flex justify-between text-sm font-medium">
                      <span>{item.name}</span>
                      <span>{item.value}%</span>
                    </div>

                    <div className="h-3 rounded-full bg-slate-200">
                      <div
                        className="h-3 rounded-full bg-blue-700"
                        style={{
                          width: `${item.value}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-10">
            <h3 className="mb-5 text-xl font-bold">
              Top 5 Contents
            </h3>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {topContents.map((item, index) => (
                <div key={index}>
                  <img
                    src={item.image}
                    alt=""
                    className="h-[240px] w-full rounded-lg object-cover"
                  />

                  <div className="mt-3 flex items-center justify-between text-sm font-semibold text-slate-600">
                    <span>❤️ {item.likes}</span>
                    <span>💬 {item.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </DefaultLayout>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function PieChartCard({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number }[];
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <h3 className="mb-4 font-bold">{title}</h3>

      <div className="h-[250px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LineChartCard({
  title,
  data,
}: {
  title: string;
  data: any[];
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <h3 className="mb-4 font-bold">{title}</h3>

      <div className="h-[300px]">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}