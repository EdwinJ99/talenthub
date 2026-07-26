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
  `Rp ${Number(value ?? 0).toLocaleString("en-US")}`;
const formatAmount = (value: number | null | undefined) =>
  Number(value ?? 0).toLocaleString("en-US");

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
    doc.text("D'BEST INFLUENCE", left, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Ruko Permata Regency D/37", left, 22);
    doc.text("Kembangan, Jakarta Barat 11510", left, 27);
    doc.text("0811 - 1262 - 726", left, 32);

    doc.setDrawColor(190, 150, 120);
    doc.setLineWidth(0.7);
    doc.circle(160, 23, 14);
    doc.setFont("times", "bold");
    doc.setFontSize(15);
    doc.setTextColor(150, 110, 85);
    doc.text("D'BEST", 160, 22, { align: "center" });
    doc.setFont("times", "bolditalic");
    doc.setFontSize(8);
    doc.text("Influence", 160, 27, { align: "center" });

    doc.setTextColor(...black);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Invoice For", left, 50);

    const invoiceDate = projectDetail?.invoiceStartDate
      ? new Date(projectDetail.invoiceStartDate)
      : new Date();
    const formattedDate = invoiceDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Brand", left, 57);
    doc.text("Contact", left, 63);
    doc.text("Project", left, 69);
    doc.text(`: ${String(projectDetail?.brand ?? "-").toUpperCase()}`, 44, 57);
    doc.text(`: ${String(projectDetail?.brandContact ?? "-") || "-"}`, 44, 63);
    doc.text(`: ${String(projectDetail?.name ?? "-")}`, 44, 69);

    const rightLabelX = 120;
    const rightColonX = 140;
    const rightValueX = 144;
    doc.text("Date", rightLabelX, 57);
    doc.text("Invoice No", rightLabelX, 63);
    doc.text(":", rightColonX, 57);
    doc.text(":", rightColonX, 63);
    doc.text(formattedDate, rightValueX, 57);
    doc.text(String(projectDetail?.code ?? "-"), rightValueX, 63);

    autoTable(doc, {
      startY: 80,
      head: [["Description", "SOW", "Platform", "Qty", "Rate Card", "Total"]],
      body: creators.map((creator) => [
        creator.name ?? "-",
        creator.sow ?? "-",
        creator.platform ?? "-",
        creator.drf_qty ?? "-",
        formatRupiah(creator.markupPrice),
        formatRupiah(creator.total),
      ]),
      theme: "grid",
      headStyles: { fillColor: brown, textColor: black, fontStyle: "bold", halign: "center", lineColor: black, lineWidth: 0.35 },
      bodyStyles: { textColor: black, fontSize: 9, lineColor: black, lineWidth: 0.35 },
      columnStyles: {
        0: { cellWidth: 36 },
        1: { cellWidth: 48 },
        2: { cellWidth: 24 },
        3: { cellWidth: 14, halign: "center" },
        4: { cellWidth: 28, halign: "right" },
        5: { cellWidth: 28, halign: "right" },
      },
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
      ["Subtotal", projectDetail?.subtotal],
      ["DPP", projectDetail?.dpp],
      ["PPN (11%)", projectDetail?.ppn],
      ["Grand Total", projectDetail?.grandTotal],
    ];
    const summaryX = right - 90;
    const summaryWidth = 90;
    const labelWidth = 40;
    const rowHeight = 6;

    rows.forEach(([label, value], index) => {
      const rowY = y + index * rowHeight;
      doc.setFillColor(...brown);
      doc.setDrawColor(...black);
      doc.setLineWidth(0.35);
      doc.rect(summaryX, rowY, labelWidth, rowHeight, "FD");
      doc.rect(summaryX + labelWidth, rowY, summaryWidth - labelWidth, rowHeight, "FD");

      doc.setTextColor(...black);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(String(label), summaryX + labelWidth / 2, rowY + 4.2, { align: "center" });
      doc.text("Rp", summaryX + labelWidth + 3, rowY + 4.2);
      doc.text(formatAmount(value as number | null | undefined), right - 2, rowY + 4.2, {
        align: "right",
      });
    });

    let signatureY = y + rows.length * rowHeight + 12;
    const signatureHeight = 52;
    if (signatureY + signatureHeight > pageHeight - 12) {
      doc.addPage();
      drawBorder();
      signatureY = 22;
    }

    const signatureX = right - 90;
    // Keep the signature grid aligned with the 40/50 subtotal grid above.
    const col1 = 40;
    const col2 = 25;
    const col3 = 25;
    const headerHeight = 7;
    const signHeight = 30;
    const nameHeight = 15;

    doc.setDrawColor(...black);
    doc.setLineWidth(0.35);
    doc.rect(signatureX, signatureY, col1, headerHeight);
    doc.rect(signatureX + col1, signatureY, col2 + col3, headerHeight);
    doc.rect(signatureX, signatureY + headerHeight, col1, signHeight);
    doc.rect(signatureX + col1, signatureY + headerHeight, col2, signHeight);
    doc.rect(signatureX + col1 + col2, signatureY + headerHeight, col3, signHeight);
    doc.rect(signatureX, signatureY + headerHeight + signHeight, col1, nameHeight);
    doc.rect(signatureX + col1, signatureY + headerHeight + signHeight, col2, nameHeight);
    doc.rect(signatureX + col1 + col2, signatureY + headerHeight + signHeight, col3, nameHeight);

    doc.setFont("times", "bold");
    doc.setFontSize(9);
    doc.text("Provided by", signatureX + col1 / 2, signatureY + 5, { align: "center" });
    doc.text("Approved By", signatureX + col1 + (col2 + col3) / 2, signatureY + 5, { align: "center" });

    const nameY = signatureY + headerHeight + signHeight + 6;
    doc.setFontSize(8);
    doc.text("Donna Bella", signatureX + col1 / 2, nameY, { align: "center" });
    doc.text("Hirajati Natawiria", signatureX + col1 + col2 / 2, nameY, { align: "center" });
    doc.text("Lilik Sujieanto", signatureX + col1 + col2 + col3 / 2, nameY, { align: "center" });
    doc.setFont("times", "bold");
    doc.text("Director", signatureX + col1 + col2 + col3 / 2, nameY + 5, { align: "center" });

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
            {[{ label: "No.", field: "no" }, { label: "Description", field: "name" }, { label: "SOW", field: "sow" }, { label: "Platform", field: "platform" }, { label: "Qty", field: "drf_qty" }, { label: "Rate Card", field: "rateCard" }, { label: "Mark Price", field: "markupPrice" }, { label: "Total", field: "total" }].map((head) => (
              <th key={head.field} onClick={() => handleSort(head.field)} className="cursor-pointer border-x border-slate-200 px-3 py-3 text-xs font-bold hover:bg-slate-50 sm:px-5 sm:py-4">{head.label}<span className="ml-1 text-slate-400">{getSortIcon(head.field)}</span></th>
            ))}
          </tr></thead>
          <tbody>{creators.map((creator, index) => (
            <tr key={creator.drf_id} className="border-b border-slate-200">
              <td className="border-x px-3 py-3 text-center sm:px-5 sm:py-4">{index + 1}</td><td className="border-x px-3 py-3 sm:px-5 sm:py-4">{creator.name ?? "-"}</td><td className="border-x px-3 py-3 sm:px-5 sm:py-4">{creator.sow ?? "-"}</td><td className="border-x px-3 py-3 text-center sm:px-5 sm:py-4">{creator.platform ?? "-"}</td><td className="border-x px-3 py-3 text-center sm:px-5 sm:py-4">{creator.drf_qty ?? "-"}</td><td className="border-x px-3 py-3 text-right sm:px-5 sm:py-4">{formatRupiah(creator.rateCard)}</td><td className="border-x px-3 py-3 text-right sm:px-5 sm:py-4">{formatRupiah(creator.markupPrice)}</td><td className="border-x px-3 py-3 text-right font-medium sm:px-5 sm:py-4">{formatRupiah(creator.total)}</td>
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
