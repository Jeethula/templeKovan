// components/Tabs.tsx
"use client";

import { useState } from "react";
import { format } from 'date-fns';

const formatTime = (dateString: string) => {
  return format(new Date(dateString), 'hh:mm a');
};

interface Muhurat {
  id: number;
  name: string;
  type: string;
  is_day: boolean;
  start: string;
  end: string;
}

interface TabsProps {
  dayMuhurat: Muhurat[];
  nightMuhurat: Muhurat[];
}

export function Tabs({ dayMuhurat, nightMuhurat }: TabsProps) {
  const [activeTab, setActiveTab] = useState("day");

  return (
    <>
      <div className="flex gap-2 sm:gap-4 mb-4">
        <button
          onClick={() => setActiveTab("day")}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
            activeTab === "day"
              ? "bg-[#663399] text-white"
              : "bg-[#663399]/10 text-[#663399] hover:bg-[#663399]/20"
          }`}
        >
          Day
        </button>
        <button
          onClick={() => setActiveTab("night")}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
            activeTab === "night"
              ? "bg-[#663399] text-white"
              : "bg-[#663399]/10 text-[#663399] hover:bg-[#663399]/20"
          }`}
        >
          Night
        </button>
      </div>

      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="w-full">
          <thead>
            <tr className="bg-[#663399]/5">
              <th className="px-2 py-2 text-left text-[11px] text-sm sm:text-sm font-semibold text-[#663399] w-1/4">
                Name
              </th>
              <th className="px-2 py-2 text-left text-[11px] text-sm sm:text-sm font-semibold text-[#663399] w-1/4">
                Type
              </th>
              <th className="px-2 py-2 text-left text-[11px] text-sm sm:text-sm font-semibold text-[#663399] w-1/4">
                Start
              </th>
              <th className="px-2 py-2 text-left text-[11px] text-sm sm:text-sm font-semibold text-[#663399] w-1/4">
                End
              </th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === "day" ? dayMuhurat : nightMuhurat).map(
              (muhurat, index) => (
                <tr
                  key={index}
                  className={`
                  ${
                    muhurat.type === "Inauspicious"
                      ? "bg-red-50/50"
                      : "bg-green-50/50"
                  }
                  hover:bg-[#663399]/5 transition-colors duration-200
                `}
                >
                  <td className="border-b border-[#663399]/10 px-2 py-1.5 sm:py-2 text-sm sm:text-sm">
                    {muhurat.name}
                  </td>
                  <td className="border-b border-[#663399]/10 px-2 py-1.5 sm:py-2 text-sm sm:text-sm">
                    {muhurat.type}
                  </td>
                  <td className="border-b border-[#663399]/10 px-2 py-1.5 sm:py-2 text-sm sm:text-sm">
                    {formatTime(muhurat.start)}
                  </td>
                  <td className="border-b border-[#663399]/10 px-2 py-1.5 sm:py-2 text-sm sm:text-sm">
                    {formatTime(muhurat.end)}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
