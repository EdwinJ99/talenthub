"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  confirmDelete,
  confirmGenerateQuotation,
  showSuccess,
} from "@/lib/alert";

import DefaultLayout from "@/components/Layout/DefaultLayout";

import DraftSection from "@/components/tracking/DraftSection";
import QuotationSection from "@/components/tracking/QuotationSection";
import RunningSection from "@/components/tracking/RunningSection";
import ReportSection from "@/components/tracking/ReportSection";
import InvoiceSection from "@/components/tracking/InvoiceSection";


export default function DraftPage() {
  const [projectDetail, setProjectDetail] = useState<any>(null);
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const steps = [
  {
    label: "Draft",
    date: projectDetail?.draftStartDate,
  },
  {
    label: "Quotation",
    date: projectDetail?.quotationStartDate,
  },
  {
    label: "Running",
    date: projectDetail?.runningStartDate,
  },
  {
    label: "Report",
    date: projectDetail?.reportStartDate,
  },
  {
    label: "Invoice",
    date: projectDetail?.invoiceStartDate,
  },
  {
    label: "Finish",
    date: projectDetail?.finishDate,
  },
];

  const [creators, setCreators] = useState<any[]>([]);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const loadProject = async () => {
  const res = await fetch(`/api/tracking?id=${projectId}`);
  const data = await res.json();

  setProjectDetail(data);
};

const loadCreators = async () => {
  const res = await fetch(`/api/tracking/detail?projectId=${projectId}`);

  const data = await res.json();

  console.log(data);

  setCreators(data.creators);

  setProjectDetail((prev: any) => ({
    ...prev,
    subtotal: data.subtotal,
    dpp: data.dpp,
    ppn: data.ppn,
    grandTotal: data.grandTotal,
  }));
};


useEffect(() => {
  if (!projectId) return;

  loadProject();
  loadCreators();
}, [projectId]);

  const handleEditDraft = () => {
  router.push(`/discovery?projectId=${projectId}&mode=edit`);
};

const handleGenerateQuotation = async () => {
  const result = await confirmGenerateQuotation();

  if (!result.isConfirmed) return;

  const res = await fetch(`/api/tracking?id=${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prj_status: 2,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.log(err);
    return;
  }

  await loadProject();

  await showSuccess(
    "Berhasil",
    "Quotation berhasil dibuat."
  );
};

const handleStartProject = async () => {
  // nanti isi update status ke Running
  console.log("Start Project");
};

const handleDelete = async (id: number) => {
  const result = await confirmDelete(
    "Hapus Creator?",
  );

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(`/api/tracking/detail?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error);
    }

    await loadCreators();

    await showSuccess(
      "Berhasil",
      "Creator berhasil dihapus dari project."
    );
  } catch (err) {
    console.error(err);
  }
};

  const handleSort = (field: string) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortDirection(direction);

    const sorted = [...creators].sort((a: any, b: any) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    setCreators(sorted);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "▲" : "▼";
  };

const statusIndex: Record<string, number> = {
  Draft: 0,
  Quotation: 1,
  Running: 2,
  Report: 3,
  Invoice: 4,
  Finish: 5,
};

const currentStep =
  statusIndex[projectDetail?.status ?? "Draft"];

  const progressWidth =
    currentStep === 0 ? "0%" : `${(currentStep / (steps.length - 1)) * 100}%`;

const renderTrackingSection = () => {
  switch (projectDetail?.status) {
    case "Draft":
      return (
        <DraftSection
          creators={creators}
          handleDelete={handleDelete}
          handleEditDraft={handleEditDraft}
          handleGenerateQuotation={handleGenerateQuotation}
          handleSort={handleSort}
          getSortIcon={getSortIcon}
        />
      );

case "Quotation":
  return (
    <QuotationSection
      creators={creators}
      projectDetail={projectDetail}
      handleSort={handleSort}
      getSortIcon={getSortIcon}
      handleStartProject={handleStartProject}
    />
  );

    case "Running":
      return (
        <RunningSection
          projectDetail={projectDetail}
        />
      );

    case "Report":
      return (
        <ReportSection
          projectDetail={projectDetail}
        />
      );

    case "Invoice":
      return (
        <InvoiceSection
          projectDetail={projectDetail}
        />
      );

    default:
      return null;
  }
};

console.log(projectDetail);
console.log(projectDetail?.status);
console.log(creators);

  return (
    <DefaultLayout>
      <div className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <h1 className="text-2xl font-bold text-slate-900">Detail Project</h1>

          <span className="mt-4 inline-flex rounded-full border border-orange-300 bg-orange-50 px-6 py-2 text-sm font-semibold text-orange-600">
            {projectDetail?.status}
          </span>

          <div className="mt-10 overflow-x-auto">
            <div className="relative min-w-[1000px] px-8">
              {/* Garis utama */}
              <div className="absolute left-14 right-14 top-3 h-1 bg-slate-300" />

              {/* Progress garis aktif */}
              <div
                className="absolute left-14 top-3 h-1 rounded-full bg-orange-500"
                style={{
                  width: progressWidth,
                }}
              />

              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const active = index <= currentStep;

                  return (
                    <div key={step.label} className="flex w-28 flex-col items-center">
                      <div
                        className={`relative h-7 w-7 rounded-full border-4 ${
                          active
                            ? "border-orange-500 bg-orange-500"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {index === 0 && (
                          <div className="absolute right-full top-1/2 h-1 w-6 -translate-y-1/2 bg-orange-500" />
                        )}
                      </div>

                      <p
                        className={`mt-3 text-sm font-semibold ${
                          active ? "text-slate-900" : "text-slate-500"
                        }`}
                      >
                        {step.label}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                      {step.date
                        ? new Date(step.date).toLocaleDateString("id-ID")
                        : "-"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <FieldBox label="Brand Name" value={projectDetail?.brand} />
            <FieldBox label="Project Name" value={projectDetail?.name} />
            <FieldBox label="PIC" value={projectDetail?.createdBy} />
            <FieldBox
              label="Date"
              value={
                  projectDetail?.createdAt
                      ? new Date(projectDetail.createdAt).toLocaleDateString("id-ID")
                      : ""
              }
          />
          </div>
        </section>
        {renderTrackingSection()}
      </div>
    </DefaultLayout>
  );
}

function FieldBox({
  label,
  value,
}: {
  label: string;
  value?: any;
}) {
  return (
    <div>
      <label className="text-lg font-semibold text-slate-400">{label}</label>
      <input
          value={value ?? ""}
          readOnly
        className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none"
      />
    </div>
  );
}
