import { ReactNode, useState } from "react";
import Link from "next/link";

import EyeIcon from "@/components/icons/EyeIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import InvoiceIcon from "@/components/icons/InvoiceIcon";

const DEFAULT_KOL_AVATAR = "/image/default-kol-avatar.png";

type Props = {
  creators: any[];
  sowOptions?: { sow_id: number; sow_nama: string | null }[];
  onSowChange?: (creatorId: number, sowId: number | null) => void;
  sowReadOnly?: boolean;
  invalidSowCreatorIds?: number[];
  reportMode?: boolean;
  runningMode?: boolean;
  invalidRunningFields?: Record<number, {
    planningUpload: boolean;
    actualUpload: boolean;
    linkContent: boolean;
  }>;

  getSortIcon: (field: string) => ReactNode;

  showDelete?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  showView?: boolean;
  onView?: (creator: any) => void;
  onCheck?: (id: number) => void;
  checkedCreators?: number[];
  handleSort: (field: string) => void;
};

export default function CreatorTable({
  creators,
  sowOptions,
  onSowChange,
  sowReadOnly = false,
  invalidSowCreatorIds = [],
  reportMode = false,
  runningMode = false,
  invalidRunningFields = {},
  handleSort,
  getSortIcon,
  showDelete = false,
  onDelete,
  onEdit,
  showView = false,
  onView,
  onCheck,
  checkedCreators = [],
}: Props) {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(creators.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const visibleCreators = creators.slice(startIndex, startIndex + pageSize);
  const headers = reportMode
    ? [
        { label: "No.", field: "no" },
        { label: "Photo", field: "photo" },
        { label: "Influencer Name", field: "name" },
        { label: "Username", field: "username" },
        { label: "URL Content", field: "drf_link_content" },
        { label: "SOW", field: "sow" },
      ]
    : [
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
        ...(runningMode
          ? [
              { label: "Planning Upload", field: "drf_planning_upload" },
              { label: "Actual Upload", field: "drf_actual_upload" },
              { label: "Link Content", field: "drf_link_content" },
            ]
          : []),
      ];

  return (
    <div className="mt-6">
      <div className="-mx-4 w-auto overflow-x-auto rounded-xl border border-slate-200 touch-pan-x sm:mx-0 sm:w-full scrollbar-thin">
        <table className={`${reportMode ? "min-w-[760px] sm:min-w-[1000px]" : "min-w-[1120px] sm:min-w-[1400px]"} w-full border-collapse text-xs sm:text-sm whitespace-nowrap`}>
          <thead>
            <tr className="border-y border-slate-300 bg-gray-100 text-left">
              {headers.map((head) => (
                <th
                  key={head.field}
                  onClick={() => handleSort(head.field)}
                  className="cursor-pointer border-x border-slate-200 px-3 py-3 text-xs font-bold hover:bg-slate-50 sm:px-4 sm:py-4"
                >
                  {head.label}

                  <span className="ml-1 text-slate-400">
                    {getSortIcon(head.field)}
                  </span>
                </th>
              ))}

              <th className="sticky right-0 border-x bg-gray-100 px-3 py-3 text-xs font-bold sm:px-4 sm:py-4">
                Action Detail
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleCreators.map((creator, index) => {
              const isChecked = checkedCreators.includes(creator.drf_id);
              const hasInvalidSow = invalidSowCreatorIds.includes(creator.drf_id);
              const invalidRunning = invalidRunningFields[creator.drf_id];

              if (reportMode) {
                return (
                  <tr key={creator.id} className="border-b border-slate-200 bg-white">
                    <td className="border-x px-4 py-3 text-center">{startIndex + index + 1}</td>
                    <td className="border-x px-4 py-3 text-center">
                      <img
                        src={creator.photo || DEFAULT_KOL_AVATAR}
                        alt={creator.name || "Creator"}
                        onError={(event) => {
                          event.currentTarget.src = DEFAULT_KOL_AVATAR;
                        }}
                        className="mx-auto h-11 w-11 rounded-full object-cover"
                      />
                    </td>
                    <td className="border-x px-4 py-3">{creator.name}</td>
                    <td className="border-x px-4 py-3">{creator.username}</td>
                    <td className="border-x px-4 py-3 text-center">
                      {creator.drf_link_content ? (
                        <a href={creator.drf_link_content} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">View content</a>
                      ) : "-"}
                    </td>
                    <td className="border-x px-4 py-3">{creator.sow ?? "-"}</td>
                    <td className="sticky right-0 border-x bg-white px-4 py-3 text-center">
                      {showView ? (
                        <Link href={`/tracking/detail/detail/${creator.drf_creatorid}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50">
                          <InvoiceIcon className="h-4 w-4 text-slate-900" /> View
                        </Link>
                      ) : "-"}
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={creator.id}
                  className="border-b border-slate-200 bg-white"
                >
                  <td className="border-x px-4 py-3 text-center">
                    {startIndex + index + 1}
                  </td>

                  <td className="border-x px-4 py-3 text-center">
                    <img
                      src={creator.photo || DEFAULT_KOL_AVATAR}
                      alt={creator.name || "Creator"}
                      onError={(event) => {
                        event.currentTarget.src = DEFAULT_KOL_AVATAR;
                      }}
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
                    {creator.followers?.toLocaleString() ?? 'N/A'}
                  </td>

                  <td className="border-x px-4 py-3 text-center">
                    {creator.totalPost?.toLocaleString() ?? 'N/A'}
                  </td>

                  <td className="border-x px-4 py-3 text-center">
                    {creator.engagementRate?.toFixed(2)}%
                  </td>

                  <td className="border-x px-4 py-3 text-center">
                    {creator.averageView?.toLocaleString() ?? 'N/A'}
                  </td>

                  <td className="border-x px-4 py-3 text-center">
                    {creator.averageViewBrand?.toLocaleString() ?? 'N/A'}
                  </td>

                  <td className="border-x px-4 py-3 text-center">
                    {creator.cpvAll?.toLocaleString() ?? 'N/A'}
                  </td>

                  <td className="border-x px-4 py-3 text-center">
                    {creator.cpvBranded?.toLocaleString() ?? 'N/A'}
                  </td>

                  <td className="border-x px-4 py-3 text-center">
                    {sowOptions ? (
                      <select
                        value={creator.sowId ?? ""}
                        disabled={sowReadOnly}
                        onChange={(event) =>
                          onSowChange?.(
                            creator.drf_id,
                            event.target.value === "" ? null : Number(event.target.value)
                          )
                        }
                        aria-label={`SOW for ${creator.name ?? "creator"}`}
                        className={`min-w-40 rounded-md border px-2 py-1.5 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 ${
                          hasInvalidSow
                            ? "border-red-500 bg-red-50 text-red-700 focus:border-red-500"
                            : "border-slate-300 bg-white text-slate-700 focus:border-sky-500"
                        }`}
                      >
                        <option value="">Select SOW</option>
                        {sowOptions.map((sow) => (
                          <option key={sow.sow_id} value={sow.sow_id}>
                            {sow.sow_nama ?? `SOW #${sow.sow_id}`}
                          </option>
                        ))}
                      </select>
                    ) : (
                      creator.sow ?? "N/A"
                    )}
                  </td>

                  <td className="border-x px-4 py-3 text-center">
                    {creator.platform ?? 'N/A'}
                  </td>

                  <td className="border-x px-4 py-3 text-center">
                    {creator.drf_qty}
                  </td>

                  <td className="border-x px-4 py-3 text-center">
                    {creator.rate?.toLocaleString() ?? 'N/A'}
                  </td>

                  <td className="border-x px-4 py-3 text-center">
                    {creator.total?.toLocaleString()}
                  </td>

                  {runningMode && (
                    <>
                      <td className={`border-x px-4 py-3 text-center ${invalidRunning?.planningUpload ? "bg-red-50 font-medium text-red-700" : ""}`}>
                        {creator.drf_planning_upload
                          ? new Date(creator.drf_planning_upload).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                          : <><span>-</span>{invalidRunning?.planningUpload && <p className="mt-1 text-xs font-bold text-red-700">Required</p>}</>}
                      </td>
                      <td className={`border-x px-4 py-3 text-center ${invalidRunning?.actualUpload ? "bg-red-50 font-medium text-red-700" : ""}`}>
                        {creator.drf_actual_upload
                          ? new Date(creator.drf_actual_upload).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                          : <><span>-</span>{invalidRunning?.actualUpload && <p className="mt-1 text-xs font-bold text-red-700">Required</p>}</>}
                      </td>
                      <td className={`border-x px-4 py-3 text-center ${invalidRunning?.linkContent ? "bg-red-50 font-medium text-red-700" : ""}`}>
                        {creator.drf_link_content ? (
                          <a href={creator.drf_link_content} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">View content</a>
                        ) : <><span>-</span>{invalidRunning?.linkContent && <p className="mt-1 text-xs font-bold text-red-700">Required</p>}</>}
                      </td>
                    </>
                  )}

                  <td className="sticky right-0 border-x bg-white px-4 py-3">
                    <div className="flex justify-center gap-3">
                      {isChecked && onEdit ? (
                        <>
                          {showView && onView && (
                            <Link href={`/tracking/detail/detail/${creator.drf_creatorid}`} className="cursor-pointer">
                              <EyeIcon className="h-5 w-5 text-sky-600" />
                            </Link>
                          )}
                          {onEdit && (
                            <button onClick={() => onEdit(creator.drf_id)}>
                              <EditIcon className="h-5 w-5 text-blue-500" />
                            </button>
                          )}
                          {showDelete && (
                            <button onClick={() => onDelete?.(creator.drf_id)}>
                              <DeleteIcon className="h-5 w-5 text-red-500" />
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {showView && onView && (
                            <Link href={`/tracking/detail/detail/${creator.drf_creatorid}`} className="cursor-pointer">
                              <EyeIcon className="h-5 w-5 text-sky-600" />
                            </Link>
                          )}
                          {onEdit && (
                            <button onClick={() => onEdit(creator.drf_id)}>
                              <EditIcon className="h-5 w-5 text-blue-500" />
                            </button>
                          )}
                          {showDelete && (
                            <button onClick={() => onDelete?.(creator.drf_id)}>
                              <DeleteIcon className="h-5 w-5 text-red-500" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {creators.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + pageSize, creators.length)} of {creators.length} entries
        </span>

        <div className="flex max-w-full overflow-x-auto rounded-md border border-gray-200">
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
