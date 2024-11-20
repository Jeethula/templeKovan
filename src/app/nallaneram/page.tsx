import { format } from 'date-fns';
import { PiCalendarStar } from 'react-icons/pi';
import { CiCalendarDate } from "react-icons/ci";
import prisma from "@/utils/prisma";
import { Tabs } from './Tabs';

// Add Skeleton Components
// const TableSkeleton = () => (
//   <>
//     <tr className="animate-pulse">
//       <th className="px-2 py-2 text-left" colSpan={4}>
//         <div className="h-6 bg-[#663399]/10 rounded-lg w-full" />
//       </th>
//     </tr>
//     {[...Array(5)].map((_, i) => (
//       <tr key={i} className="animate-pulse">
//         {[...Array(4)].map((_, j) => (
//           <td key={j} className="px-2 py-2">
//             <div className="h-5 bg-[#663399]/5 rounded-lg w-full" />
//           </td>
//         ))}
//       </tr>
//     ))}
//   </>
// );

// const HeaderSkeleton = () => (
//   <div className="flex items-center justify-between animate-pulse">
//     <div className="h-8 bg-[#663399]/10 rounded-lg w-48" />
//     <div className="h-8 bg-[#663399]/10 rounded-lg w-32" />
//   </div>
// );

interface Muhurat {
  id: number;
  name: string;
  type: string;
  is_day: boolean;
  start: string;
  end: string;
}

// const formatTime = (dateString: string) => {
//   return format(new Date(dateString), 'hh:mm a');
// };


export default async function NallaneramPage() {
  try {

    const nallaneram = await prisma.nallaNeram.findMany({
      orderBy: {
        date: 'desc'
      },
      take: 1
    });

    const muhurat = (nallaneram[0]?.muhurat || []) as unknown as Muhurat[];
    const dayMuhurat = muhurat.filter((m: Muhurat) => m.is_day);
    const nightMuhurat = muhurat.filter((m: Muhurat) => !m.is_day);

    return (
      <div className="min-h-screen bg-[#fdf0f4] py-4 px-2 sm:py-8 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-[#663399]/10">
            <h1 className="text-lg sm:text-xl md:text-3xl font-bold flex items-center text-[#663399] gap-2">
              <PiCalendarStar size={25} />
              <span className="leading-tight">Gowri Nalla Neram</span>
            </h1>
            <div className="flex items-center text-[#663399] bg-[#663399]/5 px-2.5 w-fit h-fit sm:px-3 py-1.5 rounded-lg">
              <CiCalendarDate className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
              <span className="text-xs sm:text-sm font-medium">
                {format(new Date(), 'MMM d, yyyy')}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-[#663399]/20 p-2 sm:p-4 md:p-6">
            <Tabs 
              dayMuhurat={dayMuhurat} 
              nightMuhurat={nightMuhurat} 
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return <div>Error loading data. Please try again later.</div>;
  }
}
