"use client";

import { useState } from "react";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import Link from "next/link";
import { confirmDelete, showSuccess } from "@/lib/alert";

const initialProjects = [
  {
    id: "TRS-10192929",
    name: "NEW YEAR 2",
    brand: "CAFE PRO",
    date: "24 Mei 2026 • 05.33",
    projectDate: "2026-05-24",
    status: "Draft",
  },
  {
    id: "TRS-10192930",
    name: "RAMADHAN SALE",
    brand: "KOPI KITA",
    date: "25 Mei 2026 • 08.15",
    projectDate: "2026-05-25",
    status: "Quotation",
  },
  {
    id: "TRS-10192931",
    name: "SUMMER EVENT",
    brand: "ASTRA MOTOR",
    date: "26 Mei 2026 • 09.20",
    projectDate: "2026-05-26",
    status: "Running",
  },
  {
    id: "TRS-10192932",
    name: "OPENING STORE",
    brand: "ALFAMART",
    date: "27 Mei 2026 • 10.45",
    projectDate: "2026-05-27",
    status: "Report",
  },
  {
    id: "TRS-10192933",
    name: "PROMO 2026",
    brand: "INDOMARET",
    date: "28 Mei 2026 • 13.10",
    projectDate: "2026-05-28",
    status: "Invoice",
  },
];

const getStepIndex = (status: string) =>
  steps.findIndex(
    (item) =>
      item.label.toLowerCase() === status.toLowerCase()
  );

const steps = [
  { label: "Draft", href: "/tracking/draft" },
  { label: "Quotation", href: "/tracking/quotation" },
  { label: "Running", href: "/tracking/running" },
  { label: "Report", href: "/tracking/report" },
  { label: "Invoice", href: "/tracking/invoice" },
]

const brands = [
  "CAFE PRO",
  "KOPI KITA",
  "ASTRA MOTOR",
  "ALFAMART",
  "INDOMARET",
]

const statuses = [
  "Draft",
  "Quotation",
  "Running",
  "Report",
  "Invoice",
]

export default function TrackingPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredProjects = projects.filter((project) => {
  const brandMatch =
    !selectedBrand || project.brand === selectedBrand;

  const statusMatch =
    !selectedStatus || project.status === selectedStatus;

  const startMatch =
    !startDate || project.projectDate >= startDate;

  const endMatch =
    !endDate || project.projectDate <= endDate;

  return (
    brandMatch &&
    statusMatch &&
    startMatch &&
    endMatch
  );
});

    const summary = {
      Draft: filteredProjects.filter(
        (p) => p.status === "Draft"
      ).length,

      Quotation: filteredProjects.filter(
        (p) => p.status === "Quotation"
      ).length,

      Running: filteredProjects.filter(
        (p) => p.status === "Running"
      ).length,

      Report: filteredProjects.filter(
        (p) => p.status === "Report"
      ).length,

      Invoice: filteredProjects.filter(
        (p) => p.status === "Invoice"
      ).length,
    };

const handleDelete = async (projectId: string) => {
  const result = await confirmDelete("Hapus Project?");

  if (!result.isConfirmed) return;

  setProjects((prev) =>
    prev.filter((item) => item.id !== projectId)
  );

await showSuccess(
  "Berhasil",
  "Project berhasil dihapus."
);
};

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

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DateFilterBox
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
              />
              <DateFilterBox
                label="End Date"
                value={endDate}
                onChange={setEndDate}
              />
            <SelectBox
              label="Brand"
              placeholder="Select Brand"
              options={brands}
              value={selectedBrand}
              onChange={setSelectedBrand}
            />

            <SelectBox
              label="Status"
              placeholder="Select Status"
              options={statuses}
              value={selectedStatus}
              onChange={setSelectedStatus}
            />
            </div>
          </div>
        </section>

      <section className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
      <SummaryCard
        title="DRAFT"
        value={summary.Draft.toString()}
        color="text-orange-600"
      />

      <SummaryCard
        title="QUOTATION"
        value={summary.Quotation.toString()}
        color="text-blue-600"
      />

      <SummaryCard
        title="RUNNING"
        value={summary.Running.toString()}
        color="text-emerald-600"
      />

      <SummaryCard
        title="REPORT"
        value={summary.Report.toString()}
        color="text-purple-600"
      />

      <SummaryCard
        title="INVOICE"
        value={summary.Invoice.toString()}
        color="text-amber-700"
      />
      </section>

      <section className="grid gap-5 2xl:grid-cols-2">
      {filteredProjects.map((project) => {
        const stepIndex = getStepIndex(project.status);

        return (
          <ProjectCard
            key={project.id}
            project={project}
            step={steps[stepIndex]}
            stepIndex={stepIndex}
            onDelete={handleDelete}
          />
        );
      })}
      </section>
      </div>
    </DefaultLayout>
  )
}

function DateFilterBox({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-700">
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none focus:border-sky-400"
      />
    </div>
  );
}

function SelectBox({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none focus:border-sky-400"
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>
    </div>
  );
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
    <div className="h-full min-h-[120px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
  onDelete,
}: {
project: {
  id: string
  name: string
  brand: string
  date: string
  projectDate: string
  status: string
}
  step: {
    label: string
    href: string
  }
  stepIndex: number
onDelete: (projectId: string) => Promise<void>
}) {

const statusColors = {
  Draft: {
    border: "border-orange-300",
    text: "text-orange-600",
    badge: "border-orange-300 bg-orange-50 text-orange-600",
  },

  Quotation: {
    border: "border-blue-300",
    text: "text-blue-600",
    badge: "border-blue-300 bg-blue-50 text-blue-600",
  },

  Running: {
    border: "border-emerald-300",
    text: "text-emerald-600",
    badge: "border-emerald-300 bg-emerald-50 text-emerald-600",
  },

  Report: {
    border: "border-purple-300",
    text: "text-purple-600",
    badge: "border-purple-300 bg-purple-50 text-purple-600",
  },

  Invoice: {
    border: "border-amber-300",
    text: "text-amber-700",
    badge: "border-amber-300 bg-amber-50 text-amber-700",
  },
};

const currentColor =
  statusColors[project.status as keyof typeof statusColors];

const stepIcons = {
  Draft: "📝",
  Quotation: "📋",
  Running: "🚀",
  Report: "📊",
  Invoice: "💰",
};

const stepStyles = {
  Draft:
    "border-orange-300 bg-orange-50 text-orange-600",

  Quotation:
    "border-blue-300 bg-blue-50 text-blue-600",

  Running:
    "border-emerald-300 bg-emerald-50 text-emerald-600",

  Report:
    "border-purple-300 bg-purple-50 text-purple-600",

  Invoice:
    "border-amber-300 bg-amber-50 text-amber-700",
};

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <button
      onClick={() => onDelete(project.id)}
      className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
    >
      🗑 Delete
    </button>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1.2fr_1.2fr]">
        <div>
          <p className="text-sm font-bold text-slate-900">{project.id}</p>
          <span
            className={`mt-3 inline-flex rounded-full border px-5 py-1 text-xs font-semibold ${currentColor.badge}`}
          >
        {step.label}
          </span>
          <p className="mt-5 text-xs text-slate-500">{project.date}</p>
        </div>

        <InfoBox title="PROJECT NAME" value={project.name} />
        <InfoBox title="BRAND" value={project.brand} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {steps.map((step, index) => {
          const active = index === stepIndex

            return (
            <Link
              key={step.label}
              href={`${step.href}?projectId=${project.id}`}
              className={`rounded-xl border p-3 text-center transition hover:-translate-y-0.5 hover:shadow-sm ${
                active
                  ? stepStyles[
                      step.label as keyof typeof stepStyles
                    ]
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl border text-lg ${
                  active
                    ? stepStyles[
                        step.label as keyof typeof stepStyles
                      ]
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {
                  stepIcons[
                    step.label as keyof typeof stepIcons
                  ]
                }
              </div>

              <p className="text-[9px] sm:text-[10px] font-bold tracking-widest text-slate-500">
                STEP
              </p>

              <p className="text-[10px] sm:text-[11px] font-bold text-slate-800">
                {step.label}
              </p>
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
            style={{
              left: `clamp(0px, calc(${((stepIndex + 1) / steps.length) * 100}% - 16px), calc(100% - 32px))`
            }}
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
    <div className="min-h-20 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      <p className="text-[10px] font-bold tracking-[0.25em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-sm font-bold text-slate-900">{value}</p>
    </div>
  )
}