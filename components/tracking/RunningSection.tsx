import { ReactNode } from "react";
import FileDocumentIcon from "@/components/icons/FileDocumentIcon"; // Import FileDocumentIcon
import CreatorTable from "./CreatorTable";

type Props = {
  creators: any[];
  projectDetail: any;
  checkedCreators: number[];
  handleSort: (field: string) => void;
  getSortIcon: (field: string) => ReactNode;
  handleUpdateRunningContent: (creator: any, mode: "edit" | "view") => void;
  handleGenerateReport: () => void;
  readOnly?: boolean;
  invalidRunningFields?: Record<number, {
    planningUpload: boolean;
    actualUpload: boolean;
    linkContent: boolean;
  }>;
};

export default function RunningSection({
  creators,
  projectDetail,
  checkedCreators,
  handleSort,
  getSortIcon,
  handleUpdateRunningContent,
  handleGenerateReport,
  readOnly = false,
  invalidRunningFields,
}: Props) {
  const handleExportToPdf = () => {
    console.log("Export to PDF clicked");
    // TODO: Implement PDF export logic here
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-7">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Campaign Running</h2>
      <p className="text-sm text-slate-700">
        Data From Creator
      </p>

      {/* The Running Start field is removed here */}

      <CreatorTable
        creators={creators}
        handleSort={handleSort}
        getSortIcon={getSortIcon}
        onEdit={readOnly ? undefined : (creatorId) => {
          const creatorToUpdate = creators.find(c => c.drf_id === creatorId);
          if (creatorToUpdate) handleUpdateRunningContent(creatorToUpdate, 'edit');
        }}
        checkedCreators={checkedCreators}
        runningMode
        invalidRunningFields={invalidRunningFields}
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
        <button
          onClick={handleExportToPdf}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-slate-50 sm:w-auto"
        >
          <FileDocumentIcon className="h-4 w-4" />
          Download PDF
        </button>

        {!readOnly && (
          <button
            onClick={handleGenerateReport}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white sm:w-auto"
          >
            <FileDocumentIcon className="h-4 w-4" />
            Generate Report
          </button>
        )}
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-400">{label}</label>
      <input
        readOnly
        value={value ?? ""}
        className="mt-2 h-11 w-full rounded-lg border bg-slate-50 px-4"
      />
    </div>
  );
}
