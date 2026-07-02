type Props = {
  projectDetail: any;
};

export default function ReportSection({
  projectDetail,
}: Props) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold">
        Report
      </h2>

      <p className="mt-5 text-slate-500">
        Report Creator
      </p>

    </section>
  );
}