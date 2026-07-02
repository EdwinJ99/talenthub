import { ReactNode } from "react";
import FileDocumentIcon from "@/components/icons/FileDocumentIcon";
import CreatorTable from "./CreatorTable";

type Props = {
  creators: any[];
  projectDetail: any;

  handleSort: (field: string) => void;
  getSortIcon: (field: string) => ReactNode;

  handleStartProject: () => void;
  readOnly?: boolean;
};

export default function QuotationSection({
  creators,
  projectDetail,
  handleSort,
  getSortIcon,
  handleStartProject,
  readOnly = false,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-7">
      <h2 className="text-2xl font-bold text-slate-900">
        List Of Creator
      </h2>

      <p className="text-sm text-slate-700">
        Quotation Creator
      </p>

      {/* Show Entries */}
<p className="mt-8 text-xs text-slate-500">10 data per halaman</p>

<CreatorTable
  creators={creators}
  handleSort={handleSort}
  getSortIcon={getSortIcon}
/>

<div className="mt-8 flex justify-end">
  <div className="w-[430px] rounded-xl border bg-yellow-50 p-6">

    <Row
      label="Subtotal"
      value={projectDetail?.subtotal}
    />

    <Row
      label="DPP"
      value={projectDetail?.dpp}
    />

    <Row
      label="PPN (11%)"
      value={projectDetail?.ppn}
    />

    <div className="mt-4 flex justify-between border-t pt-4 text-xl font-bold">
      <span>Grand Total</span>

      <span>
        Rp{" "}
        {projectDetail?.grandTotal?.toLocaleString("id-ID")}
      </span>
    </div>

  </div>
</div>

<div className="mt-6 h-2 rounded-full bg-slate-300">
  <div className="h-2 w-1/3 rounded-full bg-slate-200" />
</div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
        <button className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold">
          <FileDocumentIcon className="h-4 w-4" />
          Download Spreadsheet
        </button>

        <button className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold">
          <FileDocumentIcon className="h-4 w-4" />
          Send Spreadsheet
        </button>

        {!readOnly && (
          <button
            onClick={handleStartProject}
            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Start Project
          </button>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-400">
        {label}
      </label>

      <input
        value={value ?? ""}
        readOnly
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4"
      />
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="mb-2 flex justify-between">
      <span>{label}</span>

      <span>
        Rp {Number(value ?? 0).toLocaleString("id-ID")}
      </span>
    </div>
  );
}
