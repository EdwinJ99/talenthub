import DefaultLayout from "@/components/Layout/DefaultLayout";

export default async function DetailCreatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DefaultLayout>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold">
          Detail Creator #{id}
        </h1>
      </div>
    </DefaultLayout>
  );
}