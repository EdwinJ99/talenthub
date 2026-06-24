import Swal from "sweetalert2";

export const confirmDelete = async (
  title = "Hapus Data?"
) => {
  return Swal.fire({
    title,
    text: "Data yang dihapus tidak dapat dikembalikan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
    reverseButtons: true,
    confirmButtonColor: "#dc2626",
  });
};

export const showSuccess = async (
  title = "Berhasil",
  text = "Data berhasil diproses."
) => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    timer: 1500,
    showConfirmButton: false,
  });
};

export const confirmGenerateQuotation = async () => {
  return Swal.fire({
    title: "Generate Quotation?",
    text: "Draft project akan diproses menjadi quotation.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Generate",
    cancelButtonText: "Batal",
    reverseButtons: true,
    confirmButtonColor: "#16a34a",
  });
};

export const confirmStartProject = async () => {
  return Swal.fire({
    title: "Start Project?",
    text: "Project akan dipindahkan ke tahap Running.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Start",
    cancelButtonText: "Batal",
    reverseButtons: true,
    confirmButtonColor: "#16a34a",
  });
};

export const confirmGenerateReport = async () => {
  return Swal.fire({
    title: "Generate Report?",
    text: "Campaign akan dipindahkan ke tahap Report.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Generate",
    cancelButtonText: "Batal",
    reverseButtons: true,
    confirmButtonColor: "#16a34a",
  });
};

export const confirmGenerateInvoice = async () => {
  return Swal.fire({
    showConfirmButton: false,
    showCloseButton: false,
    width: 700,
    padding: 0,

    html: `
      <div style="padding:24px">

        <div
          style="
            background:#f0ab3d;
            color:white;
            font-weight:600;
            font-size:15px;
            letter-spacing:1px;
            padding:14px;
            border-radius:8px;
            position:relative;
            text-align:center;
            margin-bottom:20px;
          "
        >
          Choose Method Payment

          <span
            id="closeInvoiceModal"
            style="
              position:absolute;
              right:18px;
              top:50%;
              transform:translateY(-50%);
              font-size:32px;
              line-height:1;
              cursor:pointer;
              color:black;
              font-weight:bold;
            "
          >
            ×
          </span>
        </div>

        <div style="text-align:left">
          <label
            style="
              display:block;
              margin-bottom:6px;
              font-size:16px;
              color:#555;
            "
          >
            Bank Name
          </label>

          <select
            id="bankName"
            style="
              width:100%;
              height:50px;
              border:1px solid #d1d5db;
              border-radius:8px;
              padding:0 14px;
              font-size:16px;
              box-sizing:border-box;
            "
          >
            <option value="">Pilih Bank</option>
            <option>BCA</option>
            <option>Mandiri</option>
            <option>BNI</option>
            <option>BRI</option>
          </select>

          <div
            id="bankNameError"
            style="
              display:none;
              color:#ef4444;
              font-size:13px;
              margin-top:5px;
            "
          >
            Bank wajib dipilih
          </div>
        </div>

        <div style="margin-top:16px;text-align:left">
          <label
            style="
              display:block;
              margin-bottom:6px;
              font-size:16px;
              color:#555;
            "
          >
            Account No
          </label>

          <input
            id="accountNo"
            placeholder="Account No"
            style="
              width:100%;
              height:50px;
              border:1px solid #d1d5db;
              border-radius:8px;
              padding:0 14px;
              font-size:16px;
              box-sizing:border-box;
            "
          />

          <div
            id="accountNoError"
            style="
              display:none;
              color:#ef4444;
              font-size:13px;
              margin-top:5px;
            "
          >
            Nomor rekening wajib diisi
          </div>
        </div>

        <div style="margin-top:16px;text-align:left">
          <label
            style="
              display:block;
              margin-bottom:6px;
              font-size:16px;
              color:#555;
            "
          >
            Account Name
          </label>

          <input
            id="accountName"
            placeholder="Account Name"
            style="
              width:100%;
              height:50px;
              border:1px solid #d1d5db;
              border-radius:8px;
              padding:0 14px;
              font-size:16px;
              box-sizing:border-box;
            "
          />

          <div
            id="accountNameError"
            style="
              display:none;
              color:#ef4444;
              font-size:13px;
              margin-top:5px;
            "
          >
            Nama rekening wajib diisi
          </div>
        </div>

        <button
          id="submitInvoice"
          style="
            width:100%;
            height:54px;
            margin-top:24px;
            border:none;
            border-radius:8px;
            background:black;
            color:white;
            font-size:16px;
            font-weight:600;
            cursor:pointer;
          "
        >
          Next Generate Invoice
        </button>

      </div>
    `,

    didOpen: () => {
      document
        .getElementById("closeInvoiceModal")
        ?.addEventListener("click", () => {
          Swal.close();
        });

      document
        .getElementById("submitInvoice")
        ?.addEventListener("click", () => {
          const bankName = document.getElementById(
            "bankName"
          ) as HTMLSelectElement;

          const accountNo = document.getElementById(
            "accountNo"
          ) as HTMLInputElement;

          const accountName = document.getElementById(
            "accountName"
          ) as HTMLInputElement;

          const bankNameError =
            document.getElementById("bankNameError");

          const accountNoError =
            document.getElementById("accountNoError");

          const accountNameError =
            document.getElementById("accountNameError");

          // Reset style
          bankName.style.border = "1px solid #d1d5db";
          accountNo.style.border = "1px solid #d1d5db";
          accountName.style.border = "1px solid #d1d5db";

          bankNameError!.style.display = "none";
          accountNoError!.style.display = "none";
          accountNameError!.style.display = "none";

          let isValid = true;

          if (!bankName.value) {
            bankName.style.border = "2px solid #ef4444";
            bankNameError!.style.display = "block";
            isValid = false;
          }

          if (!accountNo.value.trim()) {
            accountNo.style.border = "2px solid #ef4444";
            accountNoError!.style.display = "block";
            isValid = false;
          }

          if (!accountName.value.trim()) {
            accountName.style.border = "2px solid #ef4444";
            accountNameError!.style.display = "block";
            isValid = false;
          }

          if (!isValid) return;

          Swal.close();

          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Invoice berhasil dibuat.",
            timer: 1500,
            showConfirmButton: false,
          });
        });
    },
  });
};

export const confirmFinishProject = async () => {
  return Swal.fire({
    title: "Finish Project?",
    text: "Project akan ditandai selesai dan tidak dapat diubah kembali.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Finish",
    cancelButtonText: "Batal",
    reverseButtons: true,
    confirmButtonColor: "#16a34a",
  });
};