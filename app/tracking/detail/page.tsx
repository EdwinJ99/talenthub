"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  confirmDelete,
  confirmGenerateQuotation,
  confirmGenerateReport,
  confirmGenerateInvoice,
  confirmFinishProject,
  confirmStartProject,
  showAlertValidationError,
  showRunningContentModal,
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
  const requestedView = searchParams.get("view");

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
  const [sowOptions, setSowOptions] = useState<
    { sow_id: number; sow_nama: string | null }[]
  >([]);
  const [invalidSowCreatorIds, setInvalidSowCreatorIds] = useState<number[]>([]);
  const [invalidRunningFields, setInvalidRunningFields] = useState<Record<number, {
    planningUpload: boolean;
    actualUpload: boolean;
    linkContent: boolean;
  }>>({});
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [checkedCreators, setCheckedCreators] = useState<number[]>([]);
  const router = useRouter();

  const loadProject = async () => {
  const res = await fetch(`/api/tracking?id=${projectId}`);
  const data = await res.json();

  setProjectDetail((prev: any) => ({
    ...prev,
    ...data,
  }));
};

const loadCreators = async () => {
  try {
    const res = await fetch(`/api/tracking/detail?projectId=${projectId}`);

    if (!res.ok) {
      // Jika respons tidak OK (misal: 500 Internal Server Error), lempar galat
      throw new Error(`Failed to fetch creators: ${res.statusText}`);
    }

    const data = await res.json();

    const loadedCreators = data.creators || [];
    setCreators(loadedCreators); // Pastikan creators adalah array

    // Set creator yang sudah punya link content sebagai "checked"
    const alreadyChecked = loadedCreators.filter((c: any) => c.drf_link_content).map((c: any) => c.drf_id);
    setCheckedCreators(alreadyChecked);

    setProjectDetail((prev: any) => ({
      ...prev,
      subtotal: data.subtotal,
      dpp: data.dpp,
      ppn: data.ppn,
      grandTotal: data.grandTotal,
    }));
  } catch (error) {
    console.error("Error loading creators:", error);
    setCreators([]); // Atur ke array kosong jika terjadi galat
  }
};

const loadSows = async () => {
  try {
    const res = await fetch("/api/sow", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch SOW");
    setSowOptions(await res.json());
  } catch (error) {
    console.error("Error loading SOW:", error);
    setSowOptions([]);
  }
};

useEffect(() => {
  if (!projectId) return;
  loadProject();
  loadCreators();
  loadSows();
}, [projectId]);

const handleSowChange = async (creatorId: number, sowId: number | null) => {
  try {
    const res = await fetch(`/api/tracking/detail?id=${creatorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drf_sow: sowId }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to update SOW");
    }

    const selectedSow = sowOptions.find((sow) => sow.sow_id === sowId);
    setCreators((current) =>
      current.map((creator) =>
        creator.drf_id === creatorId
          ? { ...creator, sowId, sow: selectedSow?.sow_nama ?? null }
          : creator
      )
    );
    setInvalidSowCreatorIds((current) =>
      current.filter((id) => id !== creatorId)
    );
  } catch (error) {
    console.error("Error updating SOW:", error);
    await loadCreators();
  }
};

  const handleEditDraft = () => {
  router.push(`/discovery?projectId=${projectId}&mode=edit`);
};

const handleGenerateQuotation = async () => {
  const creatorsWithoutSow = creators.filter((creator) => !creator.sowId);

  if (creatorsWithoutSow.length > 0) {
    setInvalidSowCreatorIds(creatorsWithoutSow.map((creator) => creator.drf_id));
    await showAlertValidationError(
      "Complete the SOW for every creator before generating the quotation."
    );
    return;
  }

  setInvalidSowCreatorIds([]);
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
    setInvalidSowCreatorIds(err.missingSowCreatorIds ?? []);
    await showAlertValidationError(
      err.error ?? "Complete the SOW for every creator before generating the quotation."
    );
    return;
  }

  await loadProject();
  await loadCreators();

  await showSuccess(
    "Success",
    "Quotation has been generated successfully."
  );

  router.push(`/tracking/detail?projectId=${projectId}&view=Quotation`);
};

const handleStartProject = async () => {
  const result = await confirmStartProject();

  if (!result.isConfirmed) return;

  const res = await fetch(`/api/tracking?id=${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prj_status: 3, // 3 = Running
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.log(err);
    return;
  }

  await loadProject();

  await showSuccess(
    "Success",
    "The project has been started."
  );

  router.push(`/tracking/detail?projectId=${projectId}&view=Running`);
};

const handleGenerateReport = async () => {
  const missingFields = creators.reduce<Record<number, {
    planningUpload: boolean;
    actualUpload: boolean;
    linkContent: boolean;
  }>>((result, creator) => {
    const fields = {
      planningUpload: !creator.drf_planning_upload,
      actualUpload: !creator.drf_actual_upload,
      linkContent: !creator.drf_link_content?.trim(),
    };

    if (fields.planningUpload || fields.actualUpload || fields.linkContent) {
      result[creator.drf_id] = fields;
    }

    return result;
  }, {});

  if (Object.keys(missingFields).length > 0) {
    setInvalidRunningFields(missingFields);
    await showAlertValidationError(
      "Complete Planning Upload, Actual Upload, and Link Content for every creator before generating the report."
    );
    return;
  }

  setInvalidRunningFields({});
  const result = await confirmGenerateReport();
  if (!result.isConfirmed) return;

  const res = await fetch(`/api/tracking?id=${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prj_status: 4 }),
  });

  if (!res.ok) {
    const err = await res.json();
    if (err.missingRunningFields) {
      setInvalidRunningFields(err.missingRunningFields);
    }
    await showAlertValidationError(
      err.error ?? "Complete all Running data before generating the report."
    );
    console.error(err);
    return;
  }

  await loadProject();
  await showSuccess("Success", "Report has been generated successfully.");
  router.push(`/tracking/detail?projectId=${projectId}&view=Report`);
};

const handleGenerateInvoice = async () => {
  const bankDetails: any = await confirmGenerateInvoice();

  // Stop when the user closes the modal or leaves a required field empty.
  if (!bankDetails) {
    return;
  }

  const res = await fetch(`/api/tracking?id=${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prj_status: 5, // 5 = Invoice
      ...bankDetails
    }),
  });

  if (!res.ok) {
    const responseText = await res.text();
    let message = "Failed to generate invoice.";

    try {
      const errorData = JSON.parse(responseText);
      message = errorData.error ?? message;
    } catch {
      message = responseText || message;
    }

    await showAlertValidationError(message);
    console.error(`Generate Invoice failed (${res.status}): ${message}`);
    return;
  }

  await loadProject();
  await showSuccess("Success", "Invoice has been generated successfully.");
  router.push(`/tracking/detail?projectId=${projectId}&view=Invoice`);
};

const handleFinishProject = async () => {
  const result = await confirmFinishProject();
  if (!result.isConfirmed) return;

  const res = await fetch(`/api/tracking?id=${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prj_ienddate: new Date().toISOString() }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    await showAlertValidationError(errorData.error ?? "Failed to complete the project.");
    return;
  }

  await loadProject();
  await showSuccess("Success", "Project has been completed successfully.");
  router.push(`/tracking/detail?projectId=${projectId}&view=Finish`);
};


const handleUpdateRunningContent = async (creator: any, mode: "edit" | "view") => {
  // Helper to format date string to YYYY-MM-DD, handles null/undefined
  const formatDateForInput = (dateStr: string | null | undefined) => {
    return dateStr ? new Date(dateStr).toISOString().split('T')[0] : "";
  };

  const result: any = await showRunningContentModal({
    id: creator.drf_id,
    name: creator.name,
    planning_upload: formatDateForInput(creator.drf_planning_upload),
    actual_upload: formatDateForInput(creator.drf_actual_upload),
    link_content: creator.drf_link_content ?? "",
  }, mode);

  // Jika user menutup modal atau dalam mode view, jangan lakukan apa-apa
  if (!result || mode === 'view') return;

  try {
    const params = new URLSearchParams({ id: creator.drf_id.toString() });
    const response = await fetch(`/api/tracking/detail?${params.toString()}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        drf_planning_upload: result.planning_upload,
        drf_actual_upload: result.actual_upload,
        drf_link_content: result.link_content,
      }),
    });

    if (!response.ok) {
      // Handle non-JSON error responses gracefully
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || "Failed to update data");
      } catch (e) {
        // If parsing as JSON fails, throw the raw text
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }
    }

    const updatedCreator = await response.json();

    // Update state creators dengan data baru
    setCreators((prevData) =>
      prevData.map((c) => (c.drf_id === updatedCreator.drf_id ? { ...c, ...updatedCreator } : c))
    );
    setInvalidRunningFields((current) => {
      const fields = {
        planningUpload: !result.planning_upload,
        actualUpload: !result.actual_upload,
        linkContent: !result.link_content?.trim(),
      };

      if (!fields.planningUpload && !fields.actualUpload && !fields.linkContent) {
        const remaining = { ...current };
        delete remaining[creator.drf_id];
        return remaining;
      }

      return { ...current, [creator.drf_id]: fields };
    });

    // Tambahkan id creator ke `checkedCreators` agar ikonnya berubah jadi mata
    if (result.link_content) {
      setCheckedCreators((prev) => [...new Set([...prev, creator.drf_id])]);
    }

    await showSuccess("Success", "Content data has been updated successfully.");
  } catch (error) {
    console.error("Error updating running content:", error);
  }
};

const handleDelete = async (id: number) => {
  const result = await confirmDelete(
    "Delete Creator?",
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
      "Success",
      "Creator has been successfully removed from the project."
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
      // Use a safe getter for potentially nested or missing properties
      const get = (obj: any, path: string) => path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
      const aValue = get(a, field);
      const bValue = get(b, field);

      if (aValue == null || bValue == null) return 0;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    setCreators(sorted);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return "↕"; // This is a symbol, no translation needed.
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

const isProjectFinished = Boolean(projectDetail?.invoiceEndDate);
const currentStep = isProjectFinished
  ? statusIndex.Finish
  : statusIndex[projectDetail?.status ?? "Draft"] ?? 0;

const canViewRequestedStep =
  requestedView !== null &&
  Object.prototype.hasOwnProperty.call(statusIndex, requestedView) &&
  statusIndex[requestedView] <= currentStep;
const viewedStatus = canViewRequestedStep
  ? requestedView
  : projectDetail?.status;
const isHistoricalView = viewedStatus !== projectDetail?.status;

const renderTrackingSection = () => {
  switch (viewedStatus) {
    case "Draft":
      return (
        <DraftSection
          creators={creators}
          projectDetail={projectDetail}
          handleDelete={handleDelete}
          handleEditDraft={handleEditDraft}
          handleGenerateQuotation={handleGenerateQuotation}
          handleSort={handleSort}
          getSortIcon={getSortIcon}
          showView={true}
          onView={(creator) => handleUpdateRunningContent(creator, "view")}
          sowOptions={sowOptions}
          onSowChange={handleSowChange}
          invalidSowCreatorIds={invalidSowCreatorIds}
          readOnly={isHistoricalView}
        />
      );

case "Quotation":
  return (
    <QuotationSection
      creators={creators}
      projectDetail={projectDetail}
      handleSort={handleSort}
      getSortIcon={getSortIcon}
      showView={true}
      onView={(creator) => handleUpdateRunningContent(creator, "view")}
      handleStartProject={handleStartProject}
      readOnly={isHistoricalView}
    />
  );

    case "Running":
      return (
        <RunningSection
          creators={creators}
          projectDetail={projectDetail}
          checkedCreators={checkedCreators}
          handleSort={handleSort}
          getSortIcon={getSortIcon}
          handleUpdateRunningContent={handleUpdateRunningContent}
          handleGenerateReport={handleGenerateReport}
          readOnly={isHistoricalView}
          invalidRunningFields={invalidRunningFields}
        />
      );

    case "Report":
      return (
        <ReportSection
          projectDetail={projectDetail}
          creators={creators}
          handleSort={handleSort}
          getSortIcon={getSortIcon}
          handleGenerateInvoice={handleGenerateInvoice}
          readOnly={isHistoricalView}
        />
      );

    case "Invoice":
      return (
        <InvoiceSection
          projectDetail={projectDetail}
          creators={creators}
          handleSort={handleSort}
          getSortIcon={getSortIcon}
          handleFinish={handleFinishProject}
          readOnly={isHistoricalView || isProjectFinished}
        />
      );

    case "Finish":
      return (
        <InvoiceSection
          projectDetail={projectDetail}
          creators={creators}
          handleSort={handleSort}
          getSortIcon={getSortIcon}
          handleFinish={handleFinishProject}
          readOnly
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
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-7">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Project Details</h1>

          <span
            className={`mt-4 inline-flex rounded-full border px-6 py-2 text-sm font-semibold ${
              isProjectFinished
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-orange-300 bg-orange-50 text-orange-600"
            }`}
          >
            {projectDetail?.status}
          </span>
          <div className="-mx-4 mt-8 overflow-x-auto px-4 touch-pan-x sm:mx-0 sm:mt-10 sm:px-0">
            <div className="relative min-w-[720px] px-4 sm:min-w-[1000px] sm:px-10">
              <div
                className={`absolute left-0 top-3 h-1 w-[60px] rounded-full ${
                  currentStep > 0 || isProjectFinished
                    ? "bg-emerald-500"
                    : "bg-orange-500"
                }`}
              />

              <div className="relative flex items-start justify-between">
                {steps.map((step, index) => {
                  const completed = index < currentStep || isProjectFinished;
                  const active = index === currentStep && !isProjectFinished;
                  const connectorColor =
                    isProjectFinished || index < currentStep
                      ? "bg-emerald-500"
                      : index === currentStep
                        ? "bg-orange-500"
                        : "bg-slate-300";

                  return (
                    <div key={step.label} className="contents">
                      <div
                        className="relative flex w-[76px] shrink-0 flex-col items-center sm:w-20"
                      >
                        <div
                          className={`relative z-10 h-7 w-7 rounded-full border-4 ${
                            completed
                              ? "border-emerald-500 bg-emerald-500"
                              : active
                                ? "border-orange-500 bg-orange-500"
                                : "border-slate-300 bg-white"
                          }`}
                        />

                        <p className="mt-3 text-center text-xs font-semibold text-slate-900 sm:text-sm">
                          {step.label}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {step.date
                            ? new Date(step.date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "-"}
                        </p>
                      </div>

                      {index < steps.length - 1 && (
                        <div className={`-mx-5 mt-3 h-1 min-w-10 flex-1 rounded-full ${connectorColor}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                className={`absolute right-0 top-3 h-1 w-[60px] rounded-full ${
                  isProjectFinished ? "bg-emerald-500" : "bg-slate-300"
                }`}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 xl:grid-cols-4">
            <FieldBox label="Brand Name" value={projectDetail?.brand} />
            <FieldBox label="Project Name" value={projectDetail?.name} />
            <FieldBox label="PIC" value={projectDetail?.createdBy} />
            <FieldBox
              label="Date"
              value={
                  projectDetail?.createdAt
                      ? new Date(projectDetail.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
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
