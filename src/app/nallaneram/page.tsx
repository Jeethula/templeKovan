'use client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { PiCalendarStar } from 'react-icons/pi';
import { CiCalendarDate } from "react-icons/ci";


// Add Skeleton Components
const TableSkeleton = () => (
  <>
    <tr className="animate-pulse">
      <th className="px-2 py-2 text-left" colSpan={4}>
        <div className="h-6 bg-[#663399]/10 rounded-lg w-full" />
      </th>
    </tr>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        {[...Array(4)].map((_, j) => (
          <td key={j} className="px-2 py-2">
            <div className="h-5 bg-[#663399]/5 rounded-lg w-full" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const HeaderSkeleton = () => (
  <div className="flex items-center justify-between animate-pulse">
    <div className="h-8 bg-[#663399]/10 rounded-lg w-48" />
    <div className="h-8 bg-[#663399]/10 rounded-lg w-32" />
  </div>
);

interface Muhurat {
  id: number;
  name: string;
  type: string;
  is_day: boolean;
  start: string;
  end: string;
}

export default function NallaneramPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('day');
  const [dayMuhurat, setDayMuhurat] = useState<Muhurat[]>([]);
  const [nightMuhurat, setNightMuhurat] = useState<Muhurat[]>([]);

  useEffect(() => {
    fetchNallaneram();
  }, []);

  const fetchNallaneram = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/nallaneram');
      const data = await response.json();
      const muhurat = data.nallaneram[0]?.muhurat || [];
      
      setDayMuhurat(muhurat.filter((m: Muhurat) => m.is_day));
      setNightMuhurat(muhurat.filter((m: Muhurat) => !m.is_day));
    } catch (error) {
      console.error('Error fetching nallaneram:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'hh:mm a');
  };

  // const TableHeader = () => (
  //   <tr className="bg-[#663399]/5">
  //     <th className="px-2 py-2 text-left text-sm sm:text-sm font-semibold text-[#663399]">Name</th>
  //     <th className="px-2 py-2 text-left text-sm sm:text-sm font-semibold text-[#663399]">Type</th>
  //     <th className="px-2 py-2 text-left text-sm sm:text-sm font-semibold text-[#663399]">Start</th>
  //     <th className="px-2 py-2 text-left text-sm sm:text-sm font-semibold text-[#663399]">End</th>
  //   </tr>
  // );

  // const MuhuratRow = ({ muhurat }: { muhurat: Muhurat }) => (
  //   <tr className={`
  //     ${muhurat.type === 'Inauspicious' ? 'bg-red-50/50' : 'bg-green-50/50'}
  //     hover:bg-[#663399]/5 transition-colors duration-200
  //   `}>
  //     <td className="border-b border-[#663399]/10 px-2 py-2 text-sm sm:text-sm">{muhurat.name}</td>
  //     <td className="border-b border-[#663399]/10 px-2 py-2 text-sm sm:text-sm">{muhurat.type}</td>
  //     <td className="border-b border-[#663399]/10 px-2 py-2 text-sm sm:text-sm">{formatTime(muhurat.start)}</td>
  //     <td className="border-b border-[#663399]/10 px-2 py-2 text-sm sm:text-sm">{formatTime(muhurat.end)}</td>
  //   </tr>
  // );

  return (
    <div className="min-h-screen bg-[#fdf0f4] py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex  sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-[#663399]/10">
          {loading ? (
            <HeaderSkeleton />
          ) : (
            <>
              <h1 className="text-lg sm:text-xl md:text-3xl font-bold flex items-center text-[#663399] gap-2">
                <PiCalendarStar size={25} />
                <span className="leading-tight">Gowri Nalla Neram</span>
              </h1>
              <div className="flex items-center  text-[#663399] bg-[#663399]/5 px-2.5 w-fit h-fit  sm:px-3 py-1.5 rounded-lg">
                <CiCalendarDate className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                <span className="text-xs sm:text-sm font-medium">
                  {format(new Date(), 'MMM d, yyyy')}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-[#663399]/20 p-2 sm:p-4 md:p-6">
          <div className="flex gap-2 sm:gap-4 mb-4">
            <button
              disabled={loading}
              onClick={() => setActiveTab('day')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                activeTab === 'day'
                  ? 'bg-[#663399] text-white'
                  : 'bg-[#663399]/10 text-[#663399] hover:bg-[#663399]/20'
              }`}
            >
              Day
            </button>
            <button
              disabled={loading}
              onClick={() => setActiveTab('night')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                activeTab === 'night'
                  ? 'bg-[#663399] text-white'
                  : 'bg-[#663399]/10 text-[#663399] hover:bg-[#663399]/20'
              }`}
            >
              Night
            </button>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full">
              <thead>
                <tr className="bg-[#663399]/5">
                  <th className="px-2 py-2 text-left text-[11px] text-sm sm:text-sm font-semibold text-[#663399] w-1/4">Name</th>
                  <th className="px-2 py-2 text-left text-[11px]  text-sm sm:text-sm font-semibold text-[#663399] w-1/4">Type</th>
                  <th className="px-2 py-2 text-left text-[11px]  text-sm sm:text-sm font-semibold text-[#663399] w-1/4">Start</th>
                  <th className="px-2 py-2 text-left text-[11px]  text-sm sm:text-sm font-semibold text-[#663399] w-1/4">End</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton />
                ) : (
                  (activeTab === 'day' ? dayMuhurat : nightMuhurat).map((muhurat, index) => (
                    <tr 
                      key={index}
                      className={`
                        ${muhurat.type === 'Inauspicious' ? 'bg-red-50/50' : 'bg-green-50/50'}
                        hover:bg-[#663399]/5 transition-colors duration-200
                      `}
                    >
                      <td className="border-b border-[#663399]/10 px-2 py-1.5 sm:py-2 text-sm sm:text-sm">{muhurat.name}</td>
                      <td className="border-b border-[#663399]/10 px-2 py-1.5 sm:py-2  text-sm sm:text-sm">{muhurat.type}</td>
                      <td className="border-b border-[#663399]/10 px-2 py-1.5 sm:py-2  text-sm sm:text-sm">{formatTime(muhurat.start)}</td>
                      <td className="border-b border-[#663399]/10 px-2 py-1.5 sm:py-2  text-sm sm:text-sm">{formatTime(muhurat.end)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
