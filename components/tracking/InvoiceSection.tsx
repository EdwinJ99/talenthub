type Props = {
  projectDetail: any;
};

export default function InvoiceSection({
  projectDetail,
}: Props) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold">
        Invoice
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <Field
          label="Invoice Number"
          value={projectDetail?.invoiceNo}
        />

        <Field
          label="Invoice Date"
          value={
            projectDetail?.invoiceStartDate
              ? new Date(
                  projectDetail.invoiceStartDate
                ).toLocaleDateString("id-ID")
              : "-"
          }
        />

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
        readOnly
        value={value ?? ""}
        className="mt-2 h-11 w-full rounded-lg border bg-slate-50 px-4"
      />
    </div>
  );
}