import * as XLSX from "xlsx-js-style";

export const createExcelWorkbook = (
  creators: any[],
  projectDetail: any
) => {
  // 1. Define headers for the table
  const headers = [
    "No.",
    "Influencer Name",
    "Username",
    "Followers",
    "Total Post",
    "ER (%)",
    "Avg. View",
    "Avg. Brand View",
    "CPV All",
    "CPV Branded",
    "SOW",
    "Platform",
    "Qty",
    "Rate",
    "Total",
  ];

  // 2. Map creator data to the desired format
  const data = creators.map((creator, index) => ({
    "No.": index + 1,
    "Influencer Name": creator.name ?? "N/A",
    Username: creator.username ?? "N/A",
    Followers: creator.followers,
    "Total Post": creator.totalPost,
    "ER (%)": creator.engagementRate,
    "Avg. View": creator.averageView,
    "Avg. Brand View": creator.averageViewBrand,
    "CPV All": creator.cpvAll,
    "CPV Branded": creator.cpvBranded,
    SOW: creator.sow ?? "N/A",
    Platform: creator.platform ?? "N/A",
    Qty: creator.drf_qty,
    Rate: creator.rate,
    Total: creator.total,
  }));

  // 3. Create worksheet and add data in sections
  const ws = XLSX.utils.aoa_to_sheet([
    [`Project: ${projectDetail?.name ?? "Untitled Project"}`],
    [`Brand: ${projectDetail?.brand ?? "N/A"}`],
    [`PIC: ${projectDetail?.createdBy ?? "N/A"} | Date: ${projectDetail?.createdAt ? new Date(projectDetail.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}`],
  ]);

  // Merge title cells
  ws["!merges"] = [
    XLSX.utils.decode_range("A1:O1"),
    XLSX.utils.decode_range("A2:O2"),
    XLSX.utils.decode_range("A3:O3"),
  ];

  // Add main data table with headers
  XLSX.utils.sheet_add_json(ws, data, {
    origin: "A5", // Start data table on row 5
    skipHeader: false,
  });

  // 4. Define styles
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFFFF" } },
    fill: { fgColor: { rgb: "FF4F81BD" } }, // Blue color
    alignment: { horizontal: "center", vertical: "center" },
  };

  const allBorders = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  // Apply title styles
  ws["A1"].s = { font: { bold: true, sz: 16 }, alignment: { horizontal: "center" } };
  ws["A2"].s = { font: { sz: 12 }, alignment: { horizontal: "center" } };
  ws["A3"].s = { font: { sz: 10, italic: true }, alignment: { horizontal: "center" } };

  const range = XLSX.utils.decode_range(ws["!ref"]!);

  // 5. Apply style to header (now on row 5, which is index 4)
  const headerRowIndex = 4;
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: headerRowIndex, c: C });
    if (!ws[address]) continue;
    ws[address].s = headerStyle;
  }

  // 6. Apply borders and number formats to all data cells
  for (let R = range.s.r; R <= range.e.r; ++R) {
    // Skip title and empty rows
    if (R < headerRowIndex) continue;

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (!ws[cell_ref]) continue;

      // Apply border only to data table
      if (R >= headerRowIndex) {
        ws[cell_ref].s = { ...ws[cell_ref].s, border: allBorders };
      }

      // Apply number formats to data table rows
      if (R > headerRowIndex) {
        if (C >= 3 && C <= 14) {
          // Columns from Followers to Total
          if (typeof ws[cell_ref].v === 'number') {
            ws[cell_ref].t = "n";
            ws[cell_ref].s.numFmt = "#,##0";
          }
        }
        if (C === 5) {
          // ER (%) column
          ws[cell_ref].s.numFmt = "0.00%";
        }
      }
    }
  }

  // 7. Set column widths
  ws["!cols"] = [
    { wch: 5 },   // No.
    { wch: 25 },  // Influencer Name
    { wch: 20 },  // Username
    { wch: 12 },  // Followers
    { wch: 10 },  // Total Post
    { wch: 8 },   // ER (%)
    { wch: 12 },  // Avg. View
    { wch: 12 },  // Avg. Brand View
    { wch: 12 },  // CPV All
    { wch: 12 },  // CPV Branded
    { wch: 30 },  // SOW
    { wch: 15 },  // Platform
    { wch: 5 },   // Qty
    { wch: 15 },  // Rate
    { wch: 15 },  // Total
  ];

  // 8. Set worksheet features
  // Freeze header row
  ws["!view"] = { freezePanes: { y: 5 } };
  // Add autofilter
  ws["!autofilter"] = { ref: `A5:O${data.length + 5}` };

  // 9. Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Creators");

  return wb;
};

export const exportToExcel = (
  creators: any[],
  projectDetail: any,
  fileName: string
) => {
  const wb = createExcelWorkbook(creators, projectDetail);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const createExcelBlob = (creators: any[], projectDetail: any) => {
  const wb = createExcelWorkbook(creators, projectDetail);
  const workbookData = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  return new Blob([workbookData], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};
