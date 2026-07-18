import { ReactNode, useState } from "react";
import Link from "next/link";
import CreatorTable from "./CreatorTable";
import ReportIcon from "@/components/icons/ReportIcon";

type Props = {
  projectDetail: any;
  creators: any[];
  handleSort: (field: string) => void;
  getSortIcon: (field: string) => ReactNode;
  handleGenerateInvoice: () => void;
  readOnly?: boolean;
};

export default function ReportSection({
  projectDetail,
  creators,
  handleSort,
  getSortIcon,
  handleGenerateInvoice,
  readOnly = false,
}: Props) {
  const [selectedReportIds, setSelectedReportIds] = useState<number[]>([]);
  const selectedQuery = selectedReportIds.map((id) => `detailIds=${id}`).join("&");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-7">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">List Result Report</h2>
      <p className="text-sm text-slate-700">Data from Creator</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">10 entries per page</p>
        <Link
          href={`/tracking/report/detail-report?projectId=${projectDetail?.id ?? ""}&${selectedQuery}`}
          aria-disabled={selectedReportIds.length === 0}
          onClick={(event) => { if (selectedReportIds.length === 0) event.preventDefault(); }}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold transition sm:w-auto ${selectedReportIds.length ? "text-slate-700 hover:bg-slate-50" : "cursor-not-allowed text-slate-400 opacity-60"}`}
        >
          <ReportIcon className="h-5 w-5" />
          View Report ({selectedReportIds.length})
        </Link>
      </div>

      <CreatorTable
        creators={creators}
        handleSort={handleSort}
        getSortIcon={getSortIcon}
        showView
        reportMode
        selectedReportIds={selectedReportIds}
        onReportSelectionChange={setSelectedReportIds}
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
        {!readOnly && (
          <button
            onClick={handleGenerateInvoice}
            className="w-full rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white sm:w-auto"
          >
            Generate Invoice
          </button>
        )}
      </div>
    </section>
  );
}
