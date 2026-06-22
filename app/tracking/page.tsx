import DefaultLayout from "@/components/Layout/DefaultLayout"
import { requireSession } from "@/lib/session"
import Link from "next/link"

const projects = [
  {
    id: "TRS-10192929",
    name: "NEW YEAR 2",
    brand: "CAFE PRO",
    date: "24 Mei 2026 • 05.33",
  },
]

const steps = [
  { label: "Draft", href: "/tracking/draft" },
  { label: "Quotation", href: "/tracking/quotation" },
  { label: "Running", href: "/tracking/running" },
  { label: "Report", href: "/tracking/report" },
  { label: "Invoice", href: "/tracking/invoice" },
]

export default async function TrackingPage() {
  await requireSession()

  return (
    <DefaultLayout>
      <div className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold tracking-[0.35em] text-sky-600">
            TRACKING
          </p>

          <div className="mt-3 grid gap-6 lg:grid-cols-[1.2fr_3fr]">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Progress Project
              </h1>
              <p className="mt-4 max-w-xs text-sm text-slate-500">
                You can tracking the all progress from project campaign
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <DateFilterBox label="Start Date" value="2026-05-24" />
              <DateFilterBox label="End Date" value="2026-05-24" />
              <FilterBox label="Brand" value="Brand Name" />
              <FilterBox label="Status" value="Status" />
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-5">
          <SummaryCard title="DRAFT" value="1" color="text-emerald-600" />
          <SummaryCard title="QUOTATION" value="1" color="text-sky-600" />
          <SummaryCard title="RUNNING" value="1" color="text-red-600" />
          <SummaryCard title="REPORT" value="0" color="text-orange-500" />
          <SummaryCard title="INVOICE" value="0" color="text-slate-900" />
        </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {projects.flatMap((project) =>
          steps.map((step, index) => (
            <ProjectCard
              key={`${project.id}-${step.label}`}
              project={project}
              step={step}
              stepIndex={index}
            />
          ))
        )}
      </section>
      </div>
    </DefaultLayout>
  )
}

function DateFilterBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-700">{label}</label>
      <input
        type="date"
        defaultValue={value}
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none focus:border-sky-400"
      />
    </div>
  )
}

function FilterBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-700">{label}</label>
      <div className="mt-2 flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600">
        <span>{value}</span>
        <span className="text-slate-400">⌄</span>
      </div>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  color,
}: {
  title: string
  value: string
  color: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold tracking-[0.35em] text-slate-500">
        {title}
      </p>
      <p className={`mt-3 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function ProjectCard({
  project,
  step,
  stepIndex,
}: {
  project: {
    id: string
    name: string
    brand: string
    date: string
  }
  step: {
    label: string
    href: string
  }
  stepIndex: number
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <button className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
        🗑 Delete
      </button>

      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1.2fr_1.2fr]">
        <div>
          <p className="text-sm font-bold text-slate-900">{project.id}</p>
          <span className="mt-3 inline-flex rounded-full border border-orange-300 bg-orange-50 px-5 py-1 text-xs font-semibold text-orange-500">
        {step.label}
          </span>
          <p className="mt-5 text-xs text-slate-500">{project.date}</p>
        </div>

        <InfoBox title="PROJECT NAME" value={project.name} />
        <InfoBox title="BRAND" value={project.brand} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="grid grid-cols-5 gap-3">
          {steps.map((step, index) => {
          const active = index <= stepIndex

            return (
              <Link
                key={step.label}
                href={`${step.href}?projectId=${project.id}`}
                className="rounded-xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-sm"
              >
                <div
                  className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg border text-sm ${
                    active
                      ? "border-sky-300 text-sky-600"
                      : "border-slate-200 text-slate-400"
                  }`}
                >
                  📄
                </div>
                <p className="text-[10px] font-bold tracking-widest text-slate-500">
                  STEP
                </p>
                <p className="text-[11px] font-bold text-slate-800">{step.label}</p>
              </Link>
            )
          })}
        </div>

        <div className="relative mt-5 h-2 rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-orange-400 via-emerald-400 to-sky-400"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
          <div
            className="absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl border border-sky-200 bg-white text-sm shadow"
            style={{ left: `calc(${((stepIndex + 1) / steps.length) * 100}% - 16px)` }}
          >
            <span className="-scale-x-100">🚶</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="min-h-24 rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold tracking-[0.25em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-sm font-bold text-slate-900">{value}</p>
    </div>
  )
}