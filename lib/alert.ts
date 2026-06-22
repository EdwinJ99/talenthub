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