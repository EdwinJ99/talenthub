"use client";

import DefaultLayout from "@/components/Layout/DefaultLayout";
import { useRouter } from "next/navigation";

const projectDetail = {
  brand: "CAFE PRO",
  projectName: "NEW YEAR 2",
  pic: "Gumelar Akhirul",
  date: "24 Mei 2026",
};

const steps = [
  "Draft",
  "Quotation",
  "Running",
  "Report",
  "Invoice",
  "Finish",
];

export default function DetailReportPage() {
    const router = useRouter();
    const currentStep = 3;

  const progressWidth =
    currentStep === 3
      ? "55%"
      : `${(currentStep / (steps.length - 1)) * 100}%`;

  const stepDates = [
    "17 May 2026",
    "20 May 2026",
    "22 May 2026",
    "24 May 2026",
    "-",
    "-",
  ];

  return (
    <DefaultLayout>
      <div className="space-y-6">

        {/* COPY DARI REPORT PAGE */}
        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mt-8 overflow-x-auto">
            <div className="relative min-w-[1000px] px-8">

              <div className="absolute left-14 right-14 top-3 h-1 rounded-full bg-slate-300" />

              <div
                className="absolute left-14 top-3 h-1 rounded-full bg-emerald-500"
                style={{ width: progressWidth }}
              />

              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const completed = index < currentStep;
                  const active = index === currentStep;

                  return (
                    <div
                      key={step}
                      className="flex w-28 flex-col items-center"
                    >
                      <div
                        className={`h-8 w-8 rounded-full border-4 ${
                          completed
                            ? "border-emerald-500 bg-emerald-500"
                            : active
                            ? "border-orange-500 bg-orange-500"
                            : "border-slate-300 bg-white"
                        }`}
                      />

                      <p className="mt-3 text-sm font-semibold">
                        {step}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {stepDates[index]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <FieldBox
              label="Brand Name"
              value={projectDetail.brand}
            />

            <FieldBox
              label="Project Name"
              value={projectDetail.projectName}
            />

            <FieldBox
              label="PIC"
              value={projectDetail.pic}
            />

            <FieldBox
              label="Date"
              value={projectDetail.date}
            />
          </div>
        </section>

        {/* DETAIL REPORT */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-3xl font-bold">
            Detail Report
        </h1>

        <p className="mt-1 text-slate-500">
            Post Performance Analytic
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">

            <div>
            <img
                src="https://picsum.photos/300/450"
                alt=""
                className="w-full rounded-3xl"
            />
            </div>

            <div>

            <h3 className="mb-3 text-xl font-bold">
                Caption
            </h3>

            <div className="rounded-xl border border-slate-200 p-4">
                Pada lancar ga ni puasanya? jangan kalah sama
                dapid ya xixixixi
            </div>

            <h3 className="mt-8 mb-4 text-xl font-bold">
                Performance
            </h3>

            <div className="grid gap-4 md:grid-cols-4">

                <MetricCard title="Likes" value="58.012" />
                <MetricCard title="Comments" value="200" />
                <MetricCard title="Saves" value="200" />
                <MetricCard title="Repost" value="300" />
                <MetricCard title="View" value="501K" />
                <MetricCard title="Play" value="58.012" />
                <MetricCard title="Duration" value="90 Second" />
                <MetricCard title="Share" value="400" />

            </div>

            </div>

        </div>
</section>
<div className="flex justify-end">
  <button
    onClick={() => router.push("/tracking/report")}
    className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
  >
    Kembali ke Report
  </button>
</div>

      </div>
    </DefaultLayout>
  );
}

function FieldBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="text-lg font-semibold text-slate-400">
        {label}
      </label>

      <input
        value={value}
        readOnly
        className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none"
      />
    </div>
  );
}   

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-lg font-bold">
        {value}
      </p>
    </div>
  );
}