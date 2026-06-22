import DefaultLayout from "@/components/Layout/DefaultLayout"
import { requireSession } from "@/lib/session"

const items = [1, 2, 3, 4, 5]
const steps = ["Draft", "Quotation", "Running", "Report", "Invoice", "Finish"]

export default async function InvoicePage() {
  await requireSession()

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Detail Project</h1>
              <span className="mt-3 inline-flex rounded-full border border-emerald-400 bg-emerald-50 px-5 py-1 text-xs font-bold text-emerald-700">
                Invoice
              </span>
            </div>

            <button className="rounded-xl border border-slate-300 bg-white px-8 py-3 text-sm font-semibold">
              ✎ Edit Header
            </button>
          </div>

          <div className="mt-10">
            <div className="relative flex items-start justify-between">
              <div className="absolute left-0 right-0 top-3 h-0.5 bg-slate-400" />
              <div className="absolute left-0 top-3 h-0.5 w-[82%] bg-orange-400" />

              {steps.map((step, index) => (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`h-6 w-6 rounded-full ${
                      index < 4
                        ? "bg-emerald-400"
                        : index === 4
                        ? "bg-orange-400"
                        : "bg-slate-400"
                    }`}
                  />
                  <p className="mt-2 text-[10px] font-semibold text-slate-700">{step}</p>
                  <p className="text-[9px] text-slate-400">
                    {index <= 4 ? "17 May 2026" : "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            <FieldBox label="Brand Name" value="Brand Name" />
            <FieldBox label="Project Name" value="Project Name" />
            <FieldBox label="PIC" value="PIC Name" />
            <FieldBox label="Date" value="Date" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">List Items</h2>
          <p className="text-sm text-slate-700">Creator Found</p>

          <div className="mt-8 flex items-center gap-2 text-xs">
            <span>Show</span>
            <input defaultValue="10" className="h-10 w-16 border border-slate-300 px-3" />
            <span>entries</span>
          </div>

          <div className="mt-6 w-full overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-max border-collapse whitespace-nowrap text-sm">
              <thead>
                <tr>
                  {["No.", "Description", "SOW", "Platforms", "Cost"].map((head) => (
                    <th key={head} className="border border-slate-200 px-6 py-4 text-center text-xs font-bold">
                      {head} <span className="text-slate-300">↕</span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item}>
                    <td className="border border-slate-200 px-6 py-4 text-center">{item}</td>
                    <td className="border border-slate-200 px-6 py-4 text-center">Test1</td>
                    <td className="border border-slate-200 px-6 py-4 text-center">
                      <select className="rounded-lg border border-slate-300 px-3 py-1">
                        <option>Feed Instagram</option>
                      </select>
                    </td>
                    <td className="border border-slate-200 px-6 py-4 text-center">Instagram</td>
                    <td className="border border-slate-200 px-6 py-4 text-center">Rp.20.000000</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8">
              <h3 className="text-xl font-bold text-slate-900">Payment Method</h3>

              <div className="mt-8 space-y-1 text-sm">
                <PaymentRow label="Bank" value="Bank Mandiri" />
                <PaymentRow label="Account No" value="12363--3284-9382" />
                <PaymentRow label="Account Name" value="D’Best Influence Marketing" />
              </div>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-8">
              <div className="space-y-2 text-sm">
                <TotalRow label="Subtotal" value="Rp. 0" />
                <TotalRow label="DPP" value="Rp. 0" />
                <TotalRow label="PPN (11%)" value="Rp. 0" />
              </div>

              <div className="mt-8 flex justify-between text-lg font-bold">
                <span>Grand Total</span>
                <span>Rp. 0</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-5">
            <button className="rounded-xl border border-slate-300 bg-white px-8 py-3 text-sm font-semibold">
              📄 Export PDF
            </button>
            <button className="rounded-xl border border-slate-300 bg-white px-8 py-3 text-sm font-semibold">
              📄 Send PDF
            </button>
            <button className="rounded-xl bg-black px-10 py-3 text-sm font-semibold text-white">
              Finish
            </button>
          </div>
        </section>
      </div>
    </DefaultLayout>
  )
}

function FieldBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-lg font-semibold text-slate-400">{label}</label>
      <input
        value={value}
        readOnly
        className="mt-3 h-12 w-full rounded-lg border border-slate-300 px-4 text-slate-400 outline-none"
      />
    </div>
  )
}

function PaymentRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  )
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  )
}