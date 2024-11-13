'use client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Muhurat {
  id: number;
  name: string;
  type: string;
  is_day: boolean;
  start: string;
  end: string;
}

export default function NallaneramPage() {
  const [dayMuhurat, setDayMuhurat] = useState<Muhurat[]>([]);
  const [nightMuhurat, setNightMuhurat] = useState<Muhurat[]>([]);

  useEffect(() => {
    fetchNallaneram();
  }, []);

  const fetchNallaneram = async () => {
    try {
      const response = await fetch('/api/nallaneram');
      const data = await response.json();
      const muhurat = data.nallaneram[0]?.muhurat || [];
      
      setDayMuhurat(muhurat.filter((m: Muhurat) => m.is_day));
      setNightMuhurat(muhurat.filter((m: Muhurat) => !m.is_day));
    } catch (error) {
      console.error('Error fetching nallaneram:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'hh:mm a');
  };

  const TableHeader = () => (
    <tr className="bg-[#663399]/5">
      <th className="px-6 py-3 text-left text-sm font-semibold text-[#663399]">Name</th>
      <th className="px-6 py-3 text-left text-sm font-semibold text-[#663399]">Type</th>
      <th className="px-6 py-3 text-left text-sm font-semibold text-[#663399]">Start</th>
      <th className="px-6 py-3 text-left text-sm font-semibold text-[#663399]">End</th>
    </tr>
  );

  const MuhuratRow = ({ muhurat }: { muhurat: Muhurat }) => (
    <tr className={`
      ${muhurat.type === 'Inauspicious' ? 'bg-red-50/50' : 'bg-green-50/50'}
      hover:bg-[#663399]/5 transition-colors duration-200
    `}>
      <td className="border-b border-[#663399]/10 px-6 py-4 text-sm">{muhurat.name}</td>
      <td className="border-b border-[#663399]/10 px-6 py-4 text-sm">{muhurat.type}</td>
      <td className="border-b border-[#663399]/10 px-6 py-4 text-sm">{formatTime(muhurat.start)}</td>
      <td className="border-b border-[#663399]/10 px-6 py-4 text-sm">{formatTime(muhurat.end)}</td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-[#fdf0f4] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#663399] mb-8 text-center">
          Gowri Nalla Neram
        </h1>
        
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-md border border-[#663399]/20 p-6">
            <h2 className="text-xl font-semibold text-[#663399] mb-4">
              Day Gowri Nalla Neram
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <TableHeader />
                </thead>
                <tbody>
                  {dayMuhurat.map((muhurat, index) => (
                    <MuhuratRow key={index} muhurat={muhurat} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-[#663399]/20 p-6">
            <h2 className="text-xl font-semibold text-[#663399] mb-4">
              Night Gowri Nalla Neram
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <TableHeader />
                </thead>
                <tbody>
                  {nightMuhurat.map((muhurat, index) => (
                    <MuhuratRow key={index} muhurat={muhurat} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
