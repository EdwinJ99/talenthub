import { ReactNode } from "react";
import FileDocumentIcon from "@/components/icons/FileDocumentIcon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import CreatorTable from "./CreatorTable";

type Props = {
  creators: any[];
  projectDetail: any;

  handleSort: (field: string) => void;
  getSortIcon: (field: string) => ReactNode;

  handleStartProject: () => void;
  readOnly?: boolean;
  showView?: boolean;
  onView?: (creator: any) => void;
};

export default function QuotationSection({
  creators,
  projectDetail,
  handleSort,
  getSortIcon,
  handleStartProject,
  showView,
  onView,
  readOnly = false,
}: Props) {
  // FUNGSI UNTUK EKSPOR KE PDF (SESUAI KODE YANG ANDA BERIKAN)
  const handleExportToPdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginX = 10;
    const contentLeft = 16;
    const contentRight = pageWidth - 16;

    const brown: [number, number, number] = [205, 159, 126];
    const black: [number, number, number] = [0, 0, 0];

    const formatRupiah = (value: number | null | undefined) =>
      Number(value ?? 0).toLocaleString("id-ID");

    // Fungsi untuk menggambar bingkai di setiap halaman
    const drawPageBorder = () => {
      doc.setDrawColor(...black);
      doc.setLineWidth(0.7);
      doc.rect(marginX, 6, pageWidth - marginX * 2, pageHeight - 12);
    };

    // Fungsi untuk menggambar KONTEN header (info, logo, dll)
    const drawHeaderContent = () => {
      // COMPANY INFO
      doc.setTextColor(...black);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("PT DUTA KARYARAYA MANDIRI", contentLeft, 16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Ruko Permata Regency D/37", contentLeft, 22);
      doc.text("Jl Haji Kelik RT 001 RW 006", contentLeft, 27);
      doc.text("Jakarta Barat - DKI Jakarta", contentLeft, 32);
      doc.text("+62 818 693 309", contentLeft, 37);

      // LOGO AREA
      doc.setDrawColor(190, 150, 120);
      doc.setLineWidth(0.4);
      doc.circle(160, 23, 14);
      doc.setFont("times", "bold");
      doc.setFontSize(14);
      doc.setTextColor(150, 110, 85);
      doc.text("D'BEST", 160, 22, { align: "center" });
      doc.setFont("times", "italic");
      doc.setFontSize(8);
      doc.text("Influence", 160, 27, { align: "center" });

      // QUOTATION INFO
      doc.setTextColor(...black);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Quotation For", contentLeft, 50);

      const dateToFormat = projectDetail?.date
        ? new Date(projectDetail.date)
        : new Date();
      const formattedDate = dateToFormat.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      doc.setFontSize(9);

      // KIRI
      doc.setFont("helvetica", "normal");
      doc.text("Brand", contentLeft, 57);
      doc.text("Project", contentLeft, 63);
      doc.text(`: ${String(projectDetail?.brand ?? "N/A").toUpperCase()}`, 44, 57);
      doc.text(`: ${String(projectDetail?.name ?? "N/A")}`, 44, 63);

      // KANAN
      const rightLabelX = 120;
      const rightColonX = 140;
      const rightValueX = 144;
      doc.text("Date", rightLabelX, 57);
      doc.text("Quotation No", rightLabelX, 63);
      doc.text(":", rightColonX, 57);
      doc.text(":", rightColonX, 63);
      doc.text(formattedDate, rightValueX, 57);
      doc.text(String(projectDetail?.quotationNo ?? "N/A"), rightValueX, 63);
    };

    // Panggil kedua fungsi untuk halaman pertama
    drawPageBorder();
    drawHeaderContent();

    // =====================================================
    // 5. TABEL CREATOR
    // =====================================================
    autoTable(doc, {
      startY: 74,

      head: [["Description", "SOW", "platfom", "Cost"]],

      body: creators.map((creator) => [
        creator.name || "N/A",

        creator.sow ||
          "1x Video Tiktok with yellowcard & 1x IG stories 15s tap link",

        creator.platform || "Instagram & Tiktok",

        `Rp ${formatRupiah(creator.total)}`,
      ]),

      theme: "grid",

      headStyles: {
        fillColor: brown,
        textColor: black,
        fontStyle: "bold",
        fontSize: 10,
        halign: "center",
        valign: "middle",
        lineColor: black,
        lineWidth: 0.35,
        cellPadding: 3,
      },

      bodyStyles: {
        textColor: black,
        fontSize: 9,
        valign: "middle",
        lineColor: black,
        lineWidth: 0.35,
        minCellHeight: creators.length === 1 ? 70 : 25,
      },

      didDrawPage: () => drawPageBorder(), // Gambar HANYA bingkai setiap kali tabel membuat halaman baru

      columnStyles: {
        0: {
          cellWidth: 44,
          halign: "center",
        },

        1: {
          cellWidth: 57,
          halign: "center",
        },

        2: {
          cellWidth: 28,
          halign: "center",
        },

        3: {
        cellWidth: 45,
          halign: "right",
        },
      },

      margin: {
        left: contentLeft,
      right: contentLeft,
      },
    });

    let currentY = (doc as any).lastAutoTable.finalY;

    // Cek jika sisa halaman tidak cukup untuk footer, maka buat halaman baru
    if (currentY > pageHeight - 120) { // 120mm = estimasi tinggi footer
      doc.addPage();
      drawPageBorder(); // Gambar HANYA bingkai di halaman baru yang dibuat manual
      currentY = 20; // Reset posisi Y di halaman baru
    }

    // =====================================================
    // 6. SUMMARY TOTAL
    // =====================================================
    const summaryX = 85;
    const summaryWidth = contentRight - summaryX;
    const labelWidth = 50;
    const rowHeight = 6;

    const summaryRows = [
      {
        label: "total",
        value: projectDetail?.subtotal,
      },
      {
        label: "DPP",
        value: projectDetail?.dpp,
      },
      {
        label: "PPN",
        value: projectDetail?.ppn,
      },
      {
        label: "Total",
        value: projectDetail?.grandTotal,
      },
    ];

    summaryRows.forEach((row, index) => {
    const y = currentY + 5 + index * rowHeight;

      doc.setFillColor(...brown);
      doc.setDrawColor(...black);
      doc.setLineWidth(0.35);

      doc.rect(summaryX, y, labelWidth, rowHeight, "FD");

      doc.rect(summaryX + labelWidth, y, summaryWidth - labelWidth, rowHeight, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);

      doc.text(row.label, summaryX + labelWidth / 2, y + 4.2, {
        align: "center",
      });

      doc.text("Rp", summaryX + labelWidth + 3, y + 4.2);

      doc.text(formatRupiah(row.value), contentRight - 2, y + 4.2, {
        align: "right",
      });
    });

    // =====================================================
    // 7. TERMS & CONDITIONS
    // =====================================================
    const termsY = currentY + 35;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);

    doc.text("Terms Of Payment", contentLeft - 2, termsY);

    doc.text(
      "1. The Payment Will be after campaign finish",
      contentLeft - 2,
      termsY + 6
    );

    doc.text(
      "2. Due Date 14 Days After Invoice is received",
      contentLeft - 2,
      termsY + 12
    );

    doc.text("Terms of revision", contentLeft - 2, termsY + 23);

    const revisionText = doc.splitTextToSize(
      "1. maximum revisions is 2x (two times). additional revision will be charged propotionally",
      68
    );

    doc.text(revisionText, contentLeft - 2, termsY + 29);

    doc.text("Cancellation & Pinalty Fee :", contentLeft - 2, termsY + 45);

    const cancellationText = doc.splitTextToSize(
      "1. Cancellation fee after approval quotation by sign or email is 50% from total project amount.",
      68
    );

    doc.text(cancellationText, contentLeft - 2, termsY + 51);

    // =====================================================
    // 8. SIGNATURE TABLE
    // =====================================================
    const signatureX = 95;
    const signatureY = termsY + 30;
    const signatureWidth = contentRight - signatureX;

    const col1 = 25;
    const col2 = 50;
    const col3 = signatureWidth - col1 - col2;

    const headerHeight = 7;
    const signHeight = 30;
    const nameHeight = 15;

    doc.setDrawColor(...black);
    doc.setLineWidth(0.35);

    // HEADER
    doc.rect(signatureX, signatureY, col1, headerHeight);

    doc.rect(signatureX + col1, signatureY, col2 + col3, headerHeight);

    // AREA TANDA TANGAN
    doc.rect(signatureX, signatureY + headerHeight, col1, signHeight);

    doc.rect(signatureX + col1, signatureY + headerHeight, col2, signHeight);

    doc.rect(
      signatureX + col1 + col2,
      signatureY + headerHeight,
      col3,
      signHeight
    );

    // NAMA
    doc.rect(
      signatureX,
      signatureY + headerHeight + signHeight,
      col1,
      nameHeight
    );

    doc.rect(
      signatureX + col1,
      signatureY + headerHeight + signHeight,
      col2,
      nameHeight
    );

    doc.rect(
      signatureX + col1 + col2,
      signatureY + headerHeight + signHeight,
      col3,
      nameHeight
    );

    // HEADER TEXT
    doc.setFont("times", "bold");
    doc.setFontSize(10);

    doc.text("Provide by", signatureX + col1 / 2, signatureY + 5, {
      align: "center",
    });

    doc.text(
      "Approved By",
      signatureX + col1 + (col2 + col3) / 2,
      signatureY + 5,
      { align: "center" }
    );

    // NAMA
    const nameY = signatureY + headerHeight + signHeight + 6;

    doc.setFontSize(9);

    doc.text("Donna Bella", signatureX + col1 / 2, nameY, { align: "center" });

    doc.text("Hirajati Natawiria", signatureX + col1 + col2 / 2, nameY, {
      align: "center",
    });

    doc.text("Lilik Sujieanto", signatureX + col1 + col2 + col3 / 2, nameY, {
      align: "center",
    });

    doc.text("Director", signatureX + col1 + col2 + col3 / 2, nameY + 5, {
      align: "center",
    });

    // =====================================================
    // 9. SAVE PDF
    // =====================================================
    const fileName = projectDetail?.brand
      ? `Quotation_${projectDetail.brand}.pdf`
      : "Quotation_Preview.pdf";

    doc.save(fileName);
  };

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
  handleSort={handleSort} // Tambahkan baris ini
  getSortIcon={getSortIcon} // Tambahkan baris ini
  showView={showView}
  onView={onView}
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
        {Number(projectDetail?.grandTotal ?? 0).toLocaleString("id-ID")}
      </span>
    </div>

  </div>
</div>

<div className="mt-6 h-2 rounded-full bg-slate-300">
  <div className="h-2 w-1/3 rounded-full bg-slate-200" />
</div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
        <button
          onClick={handleExportToPdf}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-slate-50"
        >
          <FileDocumentIcon className="h-4 w-4" />
          Download PDF
        </button>

        <button
          // onClick={handleSendPdf} // Anda bisa membuat fungsi ini nanti
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-slate-50"
        >
          <FileDocumentIcon className="h-4 w-4" />
          Send PDF
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
  value: number | null | undefined;
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
