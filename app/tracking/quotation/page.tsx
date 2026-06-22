import DefaultLayout from "@/components/Layout/DefaultLayout"
import { requireSession } from "@/lib/session"
import Link from "next/link"

const creators = [
  ["1", "William Tanuwijaya", "@williamtanu", "3.1M+", "1", "3.1%", "150K", "150K", "150K", "45.000.000"],
  ["2", "Raymond Chin", "@raymondchins", "2.3M+", "1", "4.5%", "250K", "250K", "250K", "55.000.000"],
  ["3", "Andrew Darwis", "@adarwis", "550K+", "1", "2.3%", "70K", "70K", "70K", "25.000.000"],
  ["4", "Fadil Jaidi", "@fadiljaidi", "1.6M+", "1", "1.6%", "350K", "350K", "350K", "85.000.000"],
  ["5", "Merry Riana", "@merryriana", "4.6M+", "1", "2.8%", "500K", "500K", "500K", "110.000.000"],
]

const steps = ["Draft", "Quotation", "Running", "Report", "Invoice", "Finish"]

export default async function QuotationPage() {
  await requireSession()

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Detail Project</h1>

          <span className="mt-3 inline-flex rounded-full border border-emerald-400 bg-emerald-50 px-5 py-1 text-xs font-bold text-emerald-700">
            Quotation
          </span>

          <div className="mt-10">
            <div className="relative flex items-start justify-between">
              <div className="absolute left-0 right-0 top-3 h-0.5 bg-slate-400" />
              <div className="absolute left-0 top-3 h-0.5 w-[30%] bg-orange-400" />

              {steps.map((step, index) => (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`h-6 w-6 rounded-full ${
                      index === 0
                        ? "bg-emerald-400"
                        : index === 1
                        ? "bg-orange-400"
                        : "bg-slate-400"
                    }`}
                  />
                  <p className="mt-2 text-[10px] font-semibold text-slate-700">{step}</p>
                  <p className="text-[9px] text-slate-400">
                    {index <= 1 ? "17 May 2026" : "-"}
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
          <h2 className="text-2xl font-bold text-slate-900">List Creator</h2>

          <div className="mt-8 flex items-center gap-2 text-xs">
            <span>Show</span>
            <input defaultValue="10" className="h-10 w-16 border border-slate-300 px-3" />
            <span>entries</span>
          </div>

          <div className="mt-6 w-full overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-max border-collapse whitespace-nowrap text-sm">
              <thead>
                <tr>
                  {[
                    "No.",
                    "Photo",
                    "Influencer Name",
                    "Username",
                    "Followers",
                    "Qty",
                    "ER (%)",
                    "Avr View",
                    "Avr Brand",
                    "View",
                    "Rate",
                  ].map((head) => (
                    <th key={head} className="border border-slate-200 px-4 py-4 text-left text-xs font-bold">
                      {head} <span className="text-slate-300">↕</span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {creators.map((row) => (
                  <tr key={row[0]}>
                    <td className="border border-slate-200 px-4 py-4 text-center">{row[0]}</td>
                    <td className="border border-slate-200 px-4 py-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-white">
                        🖼️
                      </div>
                    </td>
                    {row.slice(1).map((item, index) => (
                      <td key={index} className="border border-slate-200 px-4 py-4">
                        {item}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-slate-700">Showing 1 to 5 of 5 entries</p>

          <hr className="my-6 border-slate-300" />

          <div className="flex justify-end">
            <div className="w-full max-w-xl rounded-xl border border-yellow-200 bg-yellow-50 p-6">
              <div className="space-y-2 text-sm">
                <TotalRow label="Subtotal" value="Rp. 320.000.000" />
                <TotalRow label="DPP" value="Rp. 320.000.000" />
                <TotalRow label="PPN (11%)" value="Rp. 35.200.000" />
              </div>

              <div className="mt-6 flex justify-between text-lg font-bold">
                <span>Grand Total</span>
                <span>Rp. 355.200.000</span>
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
            <Link
            href="/tracking/running"
            className="rounded-xl bg-black px-8 py-3 text-sm font-semibold text-white"
            >
            Start Project
            </Link>
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

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  )
}