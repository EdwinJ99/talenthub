import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import FileDocumentIcon from "@/components/icons/FileDocumentIcon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { showAlertValidationError, showSuccess } from "@/lib/alert";

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

export default function InvoiceSection({
  projectDetail,
  creators,
  handleSort,
  getSortIcon,
  handleFinish,
  readOnly = false,
}: Props) {
  const [sending, setSending] = useState(false);
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);
  const payment = projectDetail?.payment;
  const getFileName = () =>
    `Invoice_${projectDetail?.code ?? projectDetail?.name ?? "Project"}.pdf`;

  const createInvoicePdf = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const left = 16;
    const right = pageWidth - 16;
    const brown: [number, number, number] = [205, 159, 126];
    const black: [number, number, number] = [0, 0, 0];

    const drawBorder = () => {
      doc.setDrawColor(...black);
      doc.setLineWidth(0.7);
      doc.rect(10, 6, pageWidth - 20, pageHeight - 12);
    };

    drawBorder();
    doc.setTextColor(...black);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("PT DUTA KARYARAYA MANDIRI", left, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Ruko Permata Regency D/37", left, 22);
    doc.text("Jakarta Barat - DKI Jakarta", left, 27);
    doc.text("+62 818 693 309", left, 32);

    doc.setDrawColor(190, 150, 120);
    doc.circle(160, 23, 14);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(150, 110, 85);
    doc.text("D'BEST", 160, 22, { align: "center" });
    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.text("Influence", 160, 27, { align: "center" });

    doc.setTextColor(...black);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("INVOICE", left, 47);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Brand : ${String(projectDetail?.brand ?? "-").toUpperCase()}`, left, 54);
    doc.text(`Project : ${projectDetail?.name ?? "-"}`, left, 60);
    doc.text(`Project Code : ${projectDetail?.code ?? "-"}`, left, 66);

    autoTable(doc, {
      startY: 73,
      head: [["Description", "SOW", "Platform", "Cost"]],
      body: creators.map((creator) => [
        creator.name ?? "-",
        creator.sow ?? "-",
        creator.platform ?? "-",
        formatRupiah(creator.total),
      ]),
      theme: "grid",
      headStyles: { fillColor: brown, textColor: black, fontStyle: "bold", halign: "center", lineColor: black, lineWidth: 0.35 },
      bodyStyles: { textColor: black, fontSize: 9, lineColor: black, lineWidth: 0.35 },
      columnStyles: { 0: { cellWidth: 44 }, 1: { cellWidth: 57 }, 2: { cellWidth: 28 }, 3: { cellWidth: 41, halign: "right" } },
      margin: { left, right: left },
      didDrawPage: drawBorder,
    });

    let y = (doc as any).lastAutoTable.finalY + 10;
    if (y > pageHeight - 75) {
      doc.addPage();
      drawBorder();
      y = 22;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Payment Method", left, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Bank : ${payment?.bank ?? "-"}`, left, y + 7);
    doc.text(`Account No : ${payment?.accountNo ?? "-"}`, left, y + 13);
    doc.text(`Account Name : ${payment?.accountName ?? "-"}`, left, y + 19);

    const rows = [
      ["Subtotal", formatRupiah(projectDetail?.subtotal)],
      ["DPP", formatRupiah(projectDetail?.dpp)],
      ["PPN (11%)", formatRupiah(projectDetail?.ppn)],
      ["Grand Total", formatRupiah(projectDetail?.grandTotal)],
    ];
    autoTable(doc, {
      startY: y,
      body: rows,
      theme: "grid",
      styles: { fontSize: 9, lineColor: black, lineWidth: 0.35 },
      columnStyles: { 0: { cellWidth: 40, fontStyle: "bold" }, 1: { cellWidth: 50, halign: "right" } },
      margin: { left: right - 90 },
    });

    return doc;
  };

  const handleExportPdf = () => createInvoicePdf().save(getFileName());

  const sendInvoicePdf = async (pdf: Blob, filename: string) => {
    if (!projectDetail?.id) {
      await showAlertValidationError("Project data was not found.");
      return;
    }

    try {
      setSending(true);
      const formData = new FormData();
      formData.append("invoice", pdf, filename);
      const response = await fetch(`/api/tracking/${projectDetail.id}/send-invoice`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Failed to send invoice.");
      await showSuccess("Email sent", `Invoice has been sent to ${result.email}.`);
    } catch (error) {
      await showAlertValidationError(error instanceof Error ? error.message : "Failed to send invoice.");
    } finally {
      setSending(false);
    }
  };

  const handleSendPdf = async () => {
    if (!uploadedPdf) {
      await showAlertValidationError("Upload a PDF before sending it to the brand.");
      return;
    }

    await sendInvoicePdf(uploadedPdf, uploadedPdf.name);
  };

  const handleUploadPdf = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      await showAlertValidationError("Please select a PDF file.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedPdf(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsPreviewOpen(false);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-7">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Invoice</h2>
        <p className="text-sm text-slate-700">Creator and payment details for this project.</p>
      </div>

      <div className="-mx-4 mt-8 w-auto overflow-x-auto rounded-xl border border-slate-200 touch-pan-x sm:mx-0 sm:w-full">
        <table className="min-w-[720px] w-full border-collapse text-xs sm:min-w-[850px] sm:text-sm whitespace-nowrap">
          <thead><tr className="border-y border-slate-300 bg-gray-100 text-center">
            {[{ label: "No.", field: "no" }, { label: "Description", field: "name" }, { label: "SOW", field: "sow" }, { label: "Platform", field: "platform" }, { label: "Cost", field: "total" }].map((head) => (
              <th key={head.field} onClick={() => handleSort(head.field)} className="cursor-pointer border-x border-slate-200 px-3 py-3 text-xs font-bold hover:bg-slate-50 sm:px-5 sm:py-4">{head.label}<span className="ml-1 text-slate-400">{getSortIcon(head.field)}</span></th>
            ))}
          </tr></thead>
          <tbody>{creators.map((creator, index) => (
            <tr key={creator.drf_id} className="border-b border-slate-200">
              <td className="border-x px-3 py-3 text-center sm:px-5 sm:py-4">{index + 1}</td><td className="border-x px-3 py-3 sm:px-5 sm:py-4">{creator.name ?? "-"}</td><td className="border-x px-3 py-3 sm:px-5 sm:py-4">{creator.sow ?? "-"}</td><td className="border-x px-3 py-3 text-center sm:px-5 sm:py-4">{creator.platform ?? "-"}</td><td className="border-x px-3 py-3 text-right font-medium sm:px-5 sm:py-4">{formatRupiah(creator.total)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6"><h3 className="text-xl font-bold text-slate-900">Payment Method</h3>{payment ? <div className="mt-6 space-y-4 text-sm"><PaymentRow label="Bank" value={payment.bank} /><PaymentRow label="Account No" value={payment.accountNo} /><PaymentRow label="Account Name" value={payment.accountName} /></div> : <p className="mt-6 text-sm text-slate-500">Payment details are not available for this invoice.</p>}</div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6"><div className="space-y-3 text-sm"><TotalRow label="Subtotal" value={formatRupiah(projectDetail?.subtotal)} /><TotalRow label="DPP" value={formatRupiah(projectDetail?.dpp)} /><TotalRow label="PPN (11%)" value={formatRupiah(projectDetail?.ppn)} /></div><div className="mt-6 flex justify-between border-t border-yellow-200 pt-5 text-lg font-bold text-slate-900"><span>Grand Total</span><span>{formatRupiah(projectDetail?.grandTotal)}</span></div></div>
      </div>

      {uploadedPdf && previewUrl && <div className="mt-6 flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><FileDocumentIcon className="h-5 w-5" /></div><div className="min-w-0"><p className="text-sm font-bold text-slate-900">PDF Ready to Send</p><p className="truncate text-xs text-slate-600">{uploadedPdf.name}</p></div></div><button type="button" onClick={() => setIsPreviewOpen(true)} className="inline-flex w-full justify-center rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 sm:w-auto">Preview PDF</button></div>}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button onClick={handleExportPdf} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50 sm:w-auto"><FileDocumentIcon className="h-4 w-4" />Export PDF</button>
        <input ref={uploadInputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleUploadPdf} />
        <button type="button" onClick={() => uploadInputRef.current?.click()} disabled={sending} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"><FileDocumentIcon className="h-4 w-4" />Upload PDF</button>
        <button onClick={handleSendPdf} disabled={sending || !uploadedPdf} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"><FileDocumentIcon className="h-4 w-4" />{sending ? "Sending..." : "Send PDF"}</button>
        {!readOnly && <button onClick={handleFinish} className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-8 py-3 text-sm font-semibold text-white hover:bg-slate-800 sm:w-auto"><FileDocumentIcon className="h-4 w-4" />Finish</button>}
      </div>

      {isPreviewOpen && previewUrl && <div role="dialog" aria-modal="true" aria-label="Invoice PDF preview" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onClick={() => setIsPreviewOpen(false)}><div className="flex h-[72vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-slate-200 px-5 py-3"><div className="min-w-0"><p className="text-sm font-bold text-slate-900">Invoice PDF Preview</p><p className="truncate text-xs text-slate-500">{uploadedPdf?.name}</p></div><button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Close</button></div><iframe title="Invoice PDF preview" src={previewUrl} className="min-h-0 flex-1 bg-slate-100" /></div></div>}
    </section>
  );
}

function PaymentRow({ label, value }: { label: string; value?: string | null }) { return <div className="flex items-start justify-between gap-6"><span className="text-slate-600">{label}</span><span className="text-right font-semibold text-slate-900">{value ?? "-"}</span></div>; }
function TotalRow({ label, value }: { label: string; value: string }) { return <div className="flex justify-between"><span>{label}</span><span className="font-semibold">{value}</span></div>; }
