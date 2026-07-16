import { ReactNode } from "react";
import FileDocumentIcon from "@/components/icons/FileDocumentIcon";

type Props = {
  projectDetail: any;
  creators: any[];
  handleSort: (field: string) => void;
  getSortIcon: (field: string) => ReactNode;
  handleFinish: () => void;
  readOnly?: boolean;
};

const formatRupiah = (value: number | null | undefined) =>
  `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`;

const formatDate = (value: string | Date | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

export default function InvoiceSection({
  projectDetail,
  creators,
  handleSort,
  getSortIcon,
  handleFinish,
  readOnly = false,
}: Props) {
  const payment = projectDetail?.payment;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invoice</h2>
          <p className="text-sm text-slate-700">Creator and payment details for this project.</p>
        </div>
        <div className="grid gap-2 text-sm sm:text-right">
          <p><span className="text-slate-500">Invoice No. </span><strong>{projectDetail?.invoiceNo ?? "-"}</strong></p>
          <p><span className="text-slate-500">Invoice Date </span><strong>{formatDate(projectDetail?.invoiceStartDate)}</strong></p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[850px] w-full border-collapse text-sm whitespace-nowrap">
          <thead>
            <tr className="border-y border-slate-300 bg-gray-100 text-center">
              {[
                { label: "No.", field: "no" },
                { label: "Description", field: "name" },
                { label: "SOW", field: "sow" },
                { label: "Platform", field: "platform" },
                { label: "Cost", field: "total" },
              ].map((head) => (
                <th
                  key={head.field}
                  onClick={() => handleSort(head.field)}
                  className="cursor-pointer border-x border-slate-200 px-5 py-4 text-xs font-bold hover:bg-slate-50"
                >
                  {head.label}<span className="ml-1 text-slate-400">{getSortIcon(head.field)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {creators.map((creator, index) => (
              <tr key={creator.drf_id} className="border-b border-slate-200">
                <td className="border-x px-5 py-4 text-center">{index + 1}</td>
                <td className="border-x px-5 py-4">{creator.name ?? "-"}</td>
                <td className="border-x px-5 py-4">{creator.sow ?? "-"}</td>
                <td className="border-x px-5 py-4 text-center">{creator.platform ?? "-"}</td>
                <td className="border-x px-5 py-4 text-right font-medium">{formatRupiah(creator.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-bold text-slate-900">Payment Method</h3>
          {payment ? (
            <div className="mt-6 space-y-4 text-sm">
              <PaymentRow label="Bank" value={payment.bank} />
              <PaymentRow label="Account No" value={payment.accountNo} />
              <PaymentRow label="Account Name" value={payment.accountName} />
            </div>
          ) : (
            <p className="mt-6 text-sm text-slate-500">Data payment belum tersedia untuk invoice ini.</p>
          )}
        </div>

        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
          <div className="space-y-3 text-sm">
            <TotalRow label="Subtotal" value={formatRupiah(projectDetail?.subtotal)} />
            <TotalRow label="DPP" value={formatRupiah(projectDetail?.dpp)} />
            <TotalRow label="PPN (11%)" value={formatRupiah(projectDetail?.ppn)} />
          </div>
          <div className="mt-6 flex justify-between border-t border-yellow-200 pt-5 text-lg font-bold text-slate-900">
            <span>Grand Total</span>
            <span>{formatRupiah(projectDetail?.grandTotal)}</span>
          </div>
        </div>
      </div>

      {!readOnly && (
        <div className="mt-8 flex justify-end">
          <button onClick={handleFinish} className="flex items-center gap-2 rounded-xl bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            <FileDocumentIcon className="h-4 w-4" />
            Finish
          </button>
        </div>
      )}
    </section>
  );
}

function PaymentRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <span className="text-slate-600">{label}</span>
      <span className="text-right font-semibold text-slate-900">{value ?? "-"}</span>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span>{label}</span><span className="font-semibold">{value}</span></div>;
}
