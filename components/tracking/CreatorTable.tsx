import { ReactNode } from "react";
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
  return (
    <div className="mt-6 w-full overflow-x-auto rounded-xl border border-slate-200 scrollbar-thin">
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
          {creators.map((creator) => (
            <tr
              key={creator.id}
              className="border-b border-slate-200"
            >
              <td className="border-x px-4 py-3 text-center">
                {creator.id}
              </td>

              <td className="border-x px-4 py-3 text-center">
                <img
                  src={creator.photo || "/images/avatar.png"}
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
  );
}