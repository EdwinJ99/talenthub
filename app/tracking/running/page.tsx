import DefaultLayout from "@/components/Layout/DefaultLayout"
import { requireSession } from "@/lib/session"
import Link from "next/link"

const creators = [
  ["1", "William Tanuwijaya", "-", "-", "-", "edit"],
  ["2", "Raymond Chin", "-", "-", "-", "edit"],
  ["3", "Andrew Darwis", "1/1/2026", "1/1/2026", "http://content.ig.com", "edit"],
  ["4", "Fadil Jaidi", "1/1/2026", "1/1/2026", "http://content.ig.com", "view"],
  ["5", "Merry Riana", "1/1/2026", "1/1/2026", "http://content.ig.com", "edit"],
]

const steps = ["Draft", "Quotation", "Running", "Report", "Invoice", "Finish"]

export default async function RunningPage() {
  await requireSession()

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Detail Project</h1>

          <span className="mt-3 inline-flex rounded-full border border-emerald-400 bg-emerald-50 px-5 py-1 text-xs font-bold text-emerald-700">
            Running
          </span>

          <div className="mt-10">
            <div className="relative flex items-start justify-between">
              <div className="absolute left-0 right-0 top-3 h-0.5 bg-slate-400" />
              <div className="absolute left-0 top-3 h-0.5 w-[50%] bg-orange-400" />

              {steps.map((step, index) => (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`h-6 w-6 rounded-full ${
                      index < 2
                        ? "bg-emerald-400"
                        : index === 2
                        ? "bg-orange-400"
                        : "bg-slate-400"
                    }`}
                  />
                  <p className="mt-2 text-[10px] font-semibold text-slate-700">{step}</p>
                  <p className="text-[9px] text-slate-400">
                    {index <= 2 ? "17 May 2026" : "-"}
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
          <h2 className="text-2xl font-bold text-slate-900">Campaign Running</h2>
          <p className="text-sm text-slate-700">Data From Creator</p>

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
                    "SOW",
                    "Planning Upload",
                    "Aktual Upload",
                    "Link Content",
                    "Action",
                  ].map((head) => (
                    <th key={head} className="border border-slate-200 px-4 py-4 text-center text-xs font-bold">
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
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-white">
                        🖼️
                      </div>
                    </td>
                    <td className="border border-slate-200 px-4 py-4">{row[1]}</td>
                    <td className="border border-slate-200 px-4 py-4 text-center">
                      <select className="rounded-lg border border-slate-300 px-3 py-1">
                        <option>Feed Instagram</option>
                      </select>
                    </td>
                    <td className="border border-slate-200 px-4 py-4 text-center">{row[2]}</td>
                    <td className="border border-slate-200 px-4 py-4 text-center">{row[3]}</td>
                    <td className="border border-slate-200 px-4 py-4 text-center">{row[4]}</td>
                    <td className="border border-slate-200 bg-slate-50 px-4 py-4 text-center">
                      {row[5] === "view" ? (
                        <button className="text-xl text-blue-600">👁</button>
                      ) : (
                        <div className="flex justify-center gap-4 text-xl">
                          <button className="text-yellow-500">✎</button>
                          <button className="text-emerald-600">●</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex justify-end gap-5">
            <button className="rounded-xl border border-slate-300 bg-white px-8 py-3 text-sm font-semibold">
              📄 Export PDF
            </button>

            <Link
              href="/tracking/report"
              className="rounded-xl bg-black px-8 py-3 text-sm font-semibold text-white"
            >
              Generate Report
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