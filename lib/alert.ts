import Swal from "sweetalert2";

export const confirmDelete = async (title = "Delete Data?") => {
  return Swal.fire({
    title,
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    confirmButtonColor: "#dc2626",
  });
};

export const showSuccess = async (
  title = "Success",
  text = "Data has been processed successfully."
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
    text: "The project draft will be processed into a quotation.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Generate",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    confirmButtonColor: "#16a34a",
  });
};

export const confirmStartProject = async () => {
  return Swal.fire({
    title: "Start Project?",
    text: "The project will be moved to the Running stage.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Start",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    confirmButtonColor: "#16a34a",
  });
};

export const confirmGenerateReport = async () => {
  return Swal.fire({
    title: "Generate Report?",
    text: "The campaign will be moved to the Report stage.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Generate",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    confirmButtonColor: "#16a34a",
  });
};

export const confirmGenerateInvoice = async () => {
  return new Promise((resolve) => {
    Swal.fire({
    willClose: () => {
      // Resolve with null if the user closes the modal without submitting
      // This handles clicking the 'x', pressing Esc, or clicking outside
      resolve(null);
    },
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

          <input
            id="bankName"
            type="text"
            placeholder="Contoh: BCA, BRI, Mandiri, BSI"
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
            id="bankNameError"
            style="
              display:none;
              color:#ef4444;
              font-size:13px;
              margin-top:5px;
            "
          >
            Bank is required
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
            Account number is required
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
            Account name is required
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
          ) as HTMLInputElement;

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

          // Resolve the promise with the form data
          resolve({
            pyt_bank: bankName.value,
            pyt_norek: accountNo.value.trim(),
            pyt_nama: accountName.value.trim(),
          });

          Swal.close();
        });
    },

  });
  });
};

export const confirmFinishProject = async () => {
  return Swal.fire({

    title: "Finish Project?",
    text: "The project will be marked as finished and cannot be changed again.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Finish",

    cancelButtonText: "Cancel",
    reverseButtons: true,
    confirmButtonColor: "#16a34a",
  });
};


export const showAlertValidationError = (message: string = "Please Select Min 1 KOL") => {
  return Swal.fire({
    title: "",
    text: message,
    icon: "error",
    iconColor: "#C22A1E", 
    confirmButtonColor: "#000000",
    confirmButtonText: "OK",
    customClass: {
      popup: "rounded-xl font-sans",
      title: "text-xl font-bold text-slate-900",
      htmlContainer: "text-lg font-bold text-slate-900 pt-2",
    },
    showCloseButton: true,
  });
};


export const showAlertSuccess = (message: string) => {
  return Swal.fire({
    title: "Success",
    text: message,
    icon: "success",
    confirmButtonColor: "#000000",
    customClass: {
      popup: "rounded-xl font-sans",
    },
        showCloseButton: true,
  });
};

export const showRunningContentModal = async (
  data: {
    id: number;
    name: string;
    planning_upload: string;
    actual_upload: string;
    link_content: string;
  },
  mode: "edit" | "view"
) => {
  const isView = mode === "view";

  return new Promise((resolve) => {
    Swal.fire({
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
            padding:14px;
            border-radius:8px;
            position:relative;
            text-align:center;
            margin-bottom:20px;
          "
        >
          ${isView ? "View Running Content" : "Edit Running Content"}

          <span
            id="closeRunningModal"
            style="
              position:absolute;
              right:18px;
              top:50%;
              transform:translateY(-50%);
              font-size:30px;
              cursor:pointer;
              color:black;
              font-weight:bold;
            "
          >
            ×
          </span>
        </div>

        <div style="text-align:left">
          <label>Influencer Name</label>

          <input
            value="${data.name}"
            readonly
            style="
              width:100%;
              height:50px;
              margin-top:6px;
              border:1px solid #d1d5db;
              border-radius:8px;
              padding:0 14px;
              box-sizing:border-box;
              background-color:#eee;
            "
          />
        </div>

        <div
          style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:12px;
            margin-top:16px;
          "
        >
          <div>
            <label>Planning Upload</label>

            <input
              id="planning_upload"
              type="date"
              value="${data.planning_upload}"
              ${isView ? "readonly" : ""}
              style="
                width:100%;
                height:50px;
                margin-top:6px;
                border:1px solid #d1d5db;
                border-radius:8px;
                padding:0 14px;
                box-sizing:border-box;
              "
            />
          </div>

          <div>
            <label>Actual Upload</label>

            <input
              id="actual_upload"
              type="date"
              value="${data.actual_upload}"
              ${isView ? "readonly" : ""}
              style="
                width:100%;
                height:50px;
                margin-top:6px;
                border:1px solid #d1d5db;
                border-radius:8px;
                padding:0 14px;
                box-sizing:border-box;
              "
            />
          </div>
        </div>

        <div style="margin-top:16px;text-align:left">
          <label>Link Content</label>

          <input
            id="link_content"
            value="${data.link_content}"
            ${isView ? "readonly" : ""}
            style="
              width:100%;
              height:50px;
              margin-top:6px;
              border:1px solid #d1d5db;
              border-radius:8px;
              padding:0 14px;
              box-sizing:border-box;
            "
          />
        </div>

        ${
          !isView
            ? `
          <button
            id="updateRunning"
            style="
              width:100%;
              height:52px;
              margin-top:24px;
              border:none;
              border-radius:8px;
              background:black;
              color:white;
              font-weight:600;
              cursor:pointer;
            "
          >
            Update Data
          </button>
        `
            : ""
        }

      </div>
    `,

      didOpen: () => {
        document
          .getElementById("closeRunningModal")
          ?.addEventListener("click", () => {
            Swal.close();
            resolve(null);
          });

        const updateButton = document.getElementById("updateRunning");
        if (updateButton) {
          updateButton.addEventListener("click", async () => {
            const planning_upload =
              (document.getElementById("planning_upload") as HTMLInputElement)
                ?.value || "";
            const actual_upload =
              (document.getElementById("actual_upload") as HTMLInputElement)
                ?.value || "";
            const link_content =
              (document.getElementById("link_content") as HTMLInputElement)
                ?.value || "";

            resolve({
              planning_upload,
              actual_upload,
              link_content,
            });
            Swal.close();
          });
        }
      },
    });
  });
};

export const confirmApproveCreator = async () => {
  return Swal.fire({
    title: "Approve Content?",
    text: "The creator's content will be marked as complete and ready for review.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Approve",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    confirmButtonColor: "#16a34a",

  });
};
