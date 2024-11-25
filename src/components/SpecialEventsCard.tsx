'use client';
import { FaOm } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  isSeva: boolean;
}

export default function SpecialEventsCard({ services }: { services: Service[] }) {
  const router = useRouter();
  const specialEvents = services.filter(service => !service.isSeva);
  const firstEvent = specialEvents[0];
  
  if (!firstEvent) return null;

  return (
    <div 
      onClick={() => router.push("/special")} 
      className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] rounded-xl p-4 shadow-[0_0_15px_rgba(253,185,49,0.3)] h-full"
    >
      <div className="relative h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-[#4A3800] tracking-wide">
            Special Event
          </h2>
          <div className="w-10 h-10 rounded-full bg-[#4A3800] flex items-center justify-center">
            <FaOm className="text-[#FFD700] text-xl" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col space-y-2">
          {firstEvent.image && (
            <div className="relative h-24 w-full overflow-hidden rounded-lg border-2 border-[#4A3800]/20">
              <Image
                src={firstEvent.image}
                alt={firstEvent.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A3800]/60 to-transparent"></div>
            </div>
          )}
          <h3 className="font-bold text-lg text-[#4A3800] leading-tight">
            {firstEvent.name}
          </h3>
          {/* <p className="text-[#4A3800]/80 text-sm line-clamp-2">
            {firstEvent.description}
          </p> */}
        </div>
      </div>
    </div>
  );
}