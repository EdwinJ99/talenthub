"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  confirmDelete,
  confirmGenerateQuotation,
  showSuccess,
} from "@/lib/alert";
import DefaultLayout from "@/components/Layout/DefaultLayout"
import Link from "next/link"
import FileDocumentIcon from "@/components/icons/FileDocumentIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import EyeIcon from "@/components/icons/EyeIcon";

const projectDetail = {
  id: "TRS-10192929",
  brand: "CAFE PRO",
  projectName: "NEW YEAR 2",
  pic: "Gumelar Akhirul",
  date: "24 Mei 2026",
};

const initialCreators = [
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

export default function DraftPage() {
  const [creators, setCreators] = useState(initialCreators);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const handleGenerateQuotation = async () => {
    const result = await confirmGenerateQuotation();

    if (!result.isConfirmed) return;

    await showSuccess(
      "Berhasil",
      "Quotation berhasil dibuat."
    );

    router.push("/tracking/quotation");
  };

  const handleDelete = async (creatorNo: number) => {
    const result = await confirmDelete(
      "Hapus Creator?"
    );

    if (!result.isConfirmed) return;

    setCreators((prev) =>
      prev.filter((item) => item.no !== creatorNo)
    );

    await showSuccess(
      "Berhasil",
      "Creator berhasil dihapus."
    );
  };

  const handleSort = (field: string) => {
  const direction =
    sortField === field && sortDirection === "asc"
      ? "desc"
      : "asc";

  setSortField(field);
  setSortDirection(direction);

  const sorted = [...creators].sort((a: any, b: any) => {
    const aValue = a[field];
    const bValue = b[field];

    if (typeof aValue === "number") {
      return direction === "asc"
        ? aValue - bValue
        : bValue - aValue;
    }

    return direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  setCreators(sorted);
};

const getSortIcon = (field: string) => {
  if (sortField !== field) return "↕";
  return sortDirection === "asc" ? "▲" : "▼";
};

  const currentStep = 0;

const progressWidth =
  currentStep === 0
    ? "0%"
    : `${(currentStep / (steps.length - 1)) * 100}%`;

  const stepDates = [
    projectDetail.date,
    "-",
    "-",
    "-",
    "-",
    "-",
  ];

  return (
    <DefaultLayout>
      <div className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <h1 className="text-2xl font-bold text-slate-900">Detail Project</h1>

      <span className="mt-4 inline-flex rounded-full border border-orange-300 bg-orange-50 px-6 py-2 text-sm font-semibold text-orange-600">
        Draft
      </span>

<div className="mt-10 overflow-x-auto">
  <div className="relative min-w-[1000px] px-8">

    {/* Garis utama */}
    <div className="absolute left-14 right-14 top-3 h-1 bg-slate-300" />

    {/* Progress garis aktif */}
    <div
      className="absolute left-14 top-3 h-1 rounded-full bg-orange-500"
      style={{
        width: progressWidth,
      }}
    />

    <div className="relative flex justify-between">
      {steps.map((step, index) => {
        const active = index <= currentStep;

        return (
          <div
            key={step}
            className="flex w-28 flex-col items-center"
          >
        <div
          className={`relative h-7 w-7 rounded-full border-4 ${
            active
              ? "border-orange-500 bg-orange-500"
              : "border-slate-300 bg-white"
          }`}
        >
          {index === 0 && (
            <div className="absolute right-full top-1/2 h-1 w-6 -translate-y-1/2 bg-orange-500" />
          )}
        </div>

            <p
              className={`mt-3 text-sm font-semibold ${
                active
                  ? "text-slate-900"
                  : "text-slate-500"
              }`}
            >
              {step}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {stepDates[index]}
            </p>
          </div>
        );
      })}
    </div>

  </div>
</div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FieldBox
            label="Brand Name"  
            value={projectDetail.brand}
          />

          <FieldBox
            label="Project Name"
            value={projectDetail.projectName}
          />

          <FieldBox
            label="PIC"
            value={projectDetail.pic}
          />

          <FieldBox
            label="Date"
            value={projectDetail.date}
          />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-7">
          <h2 className="text-2xl font-bold text-slate-900">List Of Creator</h2>
          <p className="text-sm text-slate-700">Data From Creator</p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span>Show</span>
              <input
                defaultValue="10"
                className="h-10 w-16 border border-slate-300 px-3"
              />
              <span>entries</span>
            </div>

            <button className="w-full rounded-xl border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-800 md:w-auto">
              ✎ Edit Draft
            </button>
          </div>

            <div className="mt-6 w-full overflow-x-auto rounded-xl border border-slate-200 scrollbar-thin">
            <table className="min-w-[1400px] w-full border-collapse text-sm whitespace-nowrap">
            <thead>
              <tr className="border-y border-slate-300 bg-white text-left">

                {[
                  { label: "No.", field: "no" },
                  { label: "Influencer Name", field: "name" },
                  { label: "Username", field: "username" },
                  { label: "Followers", field: "followers" },
                  { label: "Post", field: "post" },
                  { label: "ER (%)", field: "er" },
                  { label: "Avr View", field: "avrView" },
                  { label: "Avr Brand", field: "avrBrand" },
                  { label: "CPV All", field: "cpvAll" },
                  { label: "CPV Branded", field: "cpvBranded" },
                ].map((head) => (
                  <th
                    key={head.field}
                    onClick={() => handleSort(head.field)}
                    className="cursor-pointer border-x border-slate-200 px-4 py-4 text-xs font-bold text-slate-900 hover:bg-slate-50"
                  >
                    {head.label}

                    <span className="ml-1 text-slate-400">
                      {getSortIcon(head.field)}
                    </span>
                  </th>
                ))}

                <th className="border-x border-slate-200 px-4 py-4 text-xs font-bold text-slate-900">
                  Action Detail
                </th>

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
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        href={`/tracking/draft/detail/${creator.no}`}
                        className="text-sky-600 transition hover:scale-110"
                        title="Detail"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>

                      <button
                        className="text-red-500 transition hover:scale-110"
                        title="Delete"
                        onClick={() => handleDelete(creator.no)}
                      >
                        <DeleteIcon className="h-5 w-5" />
                      </button>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 h-2 rounded-full bg-slate-300">
            <div className="h-2 w-1/3 rounded-full bg-slate-200" />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-slate-50 md:w-auto">
            <FileDocumentIcon className="h-4 w-4" />
            Download Spreadsheet
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-slate-50 md:w-auto">
            <FileDocumentIcon className="h-4 w-4" />
            Send Spreadsheet
          </button>
          <button
            onClick={handleGenerateQuotation}
            className="w-full rounded-xl bg-black px-6 py-3 text-center text-sm font-semibold text-white md:w-auto"
          >
            Generate Quotation
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
        className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none"
      />
    </div>
  )
}