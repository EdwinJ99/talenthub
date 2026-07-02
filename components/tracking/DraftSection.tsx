import { ReactNode } from "react";
import FileDocumentIcon from "@/components/icons/FileDocumentIcon";
import CreatorTable from "./CreatorTable";

type DraftSectionProps = {
  creators: any[];

  handleDelete: (id: number) => void;
  handleEditDraft: () => void;
  handleGenerateQuotation: () => void;

  handleSort: (field: string) => void;
  getSortIcon: (field: string) => ReactNode;
};

export default function DraftSection({
  creators,
  handleDelete,
  handleEditDraft,
  handleGenerateQuotation,
  handleSort,
  getSortIcon,
}: DraftSectionProps) {
  return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-7">
          <h2 className="text-2xl font-bold text-slate-900">List Of Creator</h2>
          <p className="text-sm text-slate-700">Data From Creator</p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-slate-500">10 data per halaman</p>

          <button
            onClick={handleEditDraft}
            className="w-full rounded-xl border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-800 md:w-auto"
          >
            ✎ Edit Draft
          </button>
          </div>

          <CreatorTable
            creators={creators}
            handleSort={handleSort}
            getSortIcon={getSortIcon}
            showDelete
            onDelete={handleDelete}
          />

          <div className="mt-6 h-2 rounded-full bg-slate-300">
            <div className="h-2 w-1/3 rounded-full bg-slate-200" />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">

          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-slate-50 md:w-auto">
            <FileDocumentIcon className="h-4 w-4" />
            Download Spreadsheet
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-slate-50 md:w-auto">
            <FileDocumentIcon className="h-4 w-4" />
            Send Spreadsheet
          </button>
          <button
            onClick={handleGenerateQuotation}
            className="w-full rounded-xl bg-black px-6 py-3 text-center text-sm font-semibold text-white md:w-auto"
          >
            Generate Quotation
          </button>

          </div>
        </section>
  );
}
