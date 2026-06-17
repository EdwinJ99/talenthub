import DefaultLayout from "@/components/Layout/DefaultLayout"
import { requireSession } from "@/lib/session"
import Link from "next/link"

const creators = [
  {
    no: 1,
    name: "William Tanuwijaya",
    username: "@williamtanu",
    followers: "3.1M+",
    post: 100,
    er: "3.1%",
    avrView: "150K",
    avrBrand: "150K",
    cpvAll: 150,
    cpvBranded: 150,
  },
  {
    no: 2,
    name: "Raymond Chin",
    username: "@raymondchins",
    followers: "2.3M+",
    post: 90,
    er: "4.5%",
    avrView: "250K",
    avrBrand: "250K",
    cpvAll: 250,
    cpvBranded: 250,
  },
  {
    no: 3,
    name: "Andrew Darwis",
    username: "@adarwis",
    followers: "550K+",
    post: 120,
    er: "2.3%",
    avrView: "70K",
    avrBrand: "70K",
    cpvAll: 70,
    cpvBranded: 70,
  },
  {
    no: 4,
    name: "Fadil Jaidi",
    username: "@fadiljaidi",
    followers: "12.5M+",
    post: 200,
    er: "1.6%",
    avrView: "350K",
    avrBrand: "350K",
    cpvAll: 350,
    cpvBranded: 320,
  },
  {
    no: 5,
    name: "Merry Riana",
    username: "@merryriana",
    followers: "4.6M+",
    post: 320,
    er: "2.8%",
    avrView: "500K",
    avrBrand: "500K",
    cpvAll: 500,
    cpvBranded: 500,
  },
]

const steps = ["Draft", "Quotation", "Running", "Report", "Invoice", "Finish"]

export default async function DraftPage() {
  await requireSession()

  return (
    <DefaultLayout>
      <div className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Detail Project</h1>

          <span className="mt-3 inline-flex rounded-full border border-emerald-400 bg-emerald-50 px-8 py-1 text-xs font-semibold text-emerald-600">
            Draft
          </span>

          <div className="mt-10">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 right-0 top-3 h-0.5 bg-slate-300" />
              <div className="absolute left-0 top-3 h-0.5 w-[10%] bg-orange-400" />

              {steps.map((step, index) => (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`h-6 w-6 rounded-full ${
                      index === 0 ? "bg-orange-400" : "bg-slate-400"
                    }`}
                  />
                  <p className="mt-2 text-[10px] font-semibold text-slate-700">
                    {step}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    {index === 0 ? "17 May 2026" : "-"}
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
          <h2 className="text-2xl font-bold text-slate-900">List Of Creator</h2>
          <p className="text-sm text-slate-700">Data From Creator</p>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span>Show</span>
              <input
                defaultValue="10"
                className="h-10 w-16 border border-slate-300 px-3"
              />
              <span>entries</span>
            </div>

            <button className="rounded-xl border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-800">
              ✎ Edit Draft
            </button>
          </div>

            <div className="mt-6 w-full overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-max w-full border-collapse text-sm whitespace-nowrap">
              <thead>
                <tr className="border-y border-slate-300 bg-white text-left">
                  {[
                    "No.",
                    "Photo",
                    "Influencer Name",
                    "Username",
                    "Followers",
                    "Post",
                    "ER (%)",
                    "Avr View",
                    "Avr Brand",
                    "CPV All",
                    "CPV Branded",
                    "",
                  ].map((head) => (
                    <th
                      key={head}
                      className="border-x border-slate-200 px-4 py-4 text-xs font-bold text-slate-900"
                    >
                      {head} <span className="text-slate-300">↕</span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {creators.map((creator) => (
                  <tr key={creator.no} className="border-b border-slate-200">
                    <td className="border-x border-slate-200 px-4 py-3 text-center">
                      {creator.no}
                    </td>
                    <td className="border-x border-slate-200 px-4 py-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-white">
                        🖼️
                      </div>
                    </td>
                    <td className="border-x border-slate-200 px-4 py-3">
                      {creator.name}
                    </td>
                    <td className="border-x border-slate-200 px-4 py-3">
                      {creator.username}
                    </td>
                    <td className="border-x border-slate-200 px-4 py-3 text-center">
                      {creator.followers}
                    </td>
                    <td className="border-x border-slate-200 px-4 py-3 text-center">
                      {creator.post}
                    </td>
                    <td className="border-x border-slate-200 px-4 py-3 text-center">
                      {creator.er}
                    </td>
                    <td className="border-x border-slate-200 px-4 py-3 text-center">
                      {creator.avrView}
                    </td>
                    <td className="border-x border-slate-200 px-4 py-3 text-center">
                      {creator.avrBrand}
                    </td>
                    <td className="border-x border-slate-200 px-4 py-3 text-center">
                      {creator.cpvAll}
                    </td>
                    <td className="border-x border-slate-200 px-4 py-3 text-center">
                      {creator.cpvBranded}
                    </td>
                    <td className="border-x border-slate-200 px-4 py-3">
                      <button className="rounded-lg border border-slate-300 px-3 py-1 text-xs">
                        Fee
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 h-2 rounded-full bg-slate-300">
            <div className="h-2 w-1/3 rounded-full bg-slate-200" />
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold">
              📄 Download Spreadsheet
            </button>
            <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold">
              📄 Send Spreadsheet
            </button>
            <Link
            href="/tracking/quotation"
            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white"
            >
            Generate Quotation
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