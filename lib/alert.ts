import Swal from "sweetalert2";

export const confirmDelete = async (title = "Hapus Data?") => {
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

export const confirmFinishProject = async () => {
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
  });
};