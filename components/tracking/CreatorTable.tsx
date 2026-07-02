import { ReactNode, useState } from "react";
import Link from "next/link";

import EyeIcon from "@/components/icons/EyeIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";

type Props = {
  creators: any[];

  handleSort: (field: string) => void;
  getSortIcon: (field: string) => ReactNode;

  showDelete?: boolean;
  onDelete?: (id: number) => void;
};

export default function CreatorTable({
  creators,
  handleSort,
  getSortIcon,
  showDelete = false,
  onDelete,
}: Props) {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(creators.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const visibleCreators = creators.slice(startIndex, startIndex + pageSize);

  return (
    <div className="mt-6">
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 scrollbar-thin">
      <table className="min-w-[1400px] w-full border-collapse text-sm whitespace-nowrap">
        <thead>
          <tr className="border-y border-slate-300 bg-white text-left">
            {[
              { label: "No.", field: "no" },
              { label: "Photo", field: "photo" },
              { label: "Influencer Name", field: "name" },
              { label: "Username", field: "username" },
              { label: "Followers", field: "followers" },
              { label: "Post", field: "post" },
              { label: "ER (%)", field: "engagementRate" },
              { label: "Avr View", field: "averageView" },
              { label: "Avr Brand", field: "averageViewBrand" },
              { label: "CPV All", field: "cpvAll" },
              { label: "CPV Branded", field: "cpvBranded" },
              { label: "SOW", field: "sow" },
              { label: "Platform", field: "platform" },
              { label: "Qty", field: "qty" },
              { label: "Rate", field: "rate" },
              { label: "Total", field: "total" },
            ].map((head) => (
              <th
                key={head.field}
                onClick={() => handleSort(head.field)}
                className="cursor-pointer border-x border-slate-200 px-4 py-4 text-xs font-bold hover:bg-slate-50"
              >
                {head.label}

                <span className="ml-1 text-slate-400">
                  {getSortIcon(head.field)}
                </span>
              </th>
            ))}

            <th className="border-x px-4 py-4 text-xs font-bold">
              Action Detail
            </th>
          </tr>
        </thead>

        <tbody>
          {visibleCreators.map((creator, index) => (
            <tr
              key={creator.id}
              className="border-b border-slate-200"
            >
              <td className="border-x px-4 py-3 text-center">
                {startIndex + index + 1}
              </td>

              <td className="border-x px-4 py-3 text-center">
                <img
                  src={creator.photo || "/images/avatar.png"}
                  alt={creator.name || "Creator"}
                  className="mx-auto h-11 w-11 rounded-full object-cover"
                />
              </td>

              <td className="border-x px-4 py-3">
                {creator.name}
              </td>

              <td className="border-x px-4 py-3">
                {creator.username}
              </td>

              <td className="border-x px-4 py-3 text-center">
                {creator.followers?.toLocaleString()}
              </td>

              <td className="border-x px-4 py-3 text-center">
                {creator.totalPost?.toLocaleString()}
              </td>

              <td className="border-x px-4 py-3 text-center">
                {creator.engagementRate}%
              </td>

              <td className="border-x px-4 py-3 text-center">
                {creator.averageView?.toLocaleString()}
              </td>

              <td className="border-x px-4 py-3 text-center">
                {creator.averageViewBrand?.toLocaleString()}
              </td>

              <td className="border-x px-4 py-3 text-center">
                {creator.cpvAll}
              </td>

              <td className="border-x px-4 py-3 text-center">
                {creator.cpvBranded}
              </td>

              <td className="border-x px-4 py-3 text-center">
                {creator.sow}
              </td>

              <td className="border-x px-4 py-3 text-center">
                {creator.platform}
              </td>

              <td className="border-x px-4 py-3 text-center">
                {creator.qty}
              </td>

              <td className="border-x px-4 py-3 text-center">
                {creator.rate?.toLocaleString()}
              </td>

              <td className="border-x px-4 py-3 text-center">
                {creator.total?.toLocaleString()}
              </td>

              <td className="border-x px-4 py-3">
                <div className="flex justify-center gap-3">
                  <Link href={`/tracking/detail/detail/${creator.id}`}>
                    <EyeIcon className="h-5 w-5 text-sky-600" />
                  </Link>

                  {showDelete && (
                    <button onClick={() => onDelete?.(creator.id)}>
                      <DeleteIcon className="h-5 w-5 text-red-500" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {creators.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + pageSize, creators.length)} of {creators.length} entries
        </span>

        <div className="flex overflow-hidden rounded-md border border-gray-200">
            <button
              type="button"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
              className="border-r border-gray-200 bg-gray-100 px-3 py-1 hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`border-r border-gray-200 px-3 py-1 ${
                    pageNumber === safeCurrentPage
                      ? "bg-blue-50 font-bold text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              type="button"
              disabled={safeCurrentPage === totalPages}
              onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
              className="bg-gray-100 px-3 py-1 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
        </div>
      </div>
    </div>
  );
}
