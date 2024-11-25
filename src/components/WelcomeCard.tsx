'use client';

import { FaOm } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { quotes } from "@/app/data";

interface WelcomeCardProps {
  isPosUser?: boolean;
  className?: string;
  isMobile?: boolean;
  onSwipe?: (direction: 'left' | 'right') => void;
}

export default function WelcomeCard({ isPosUser = false, className = '', isMobile = false }: WelcomeCardProps) {
  const router = useRouter();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning !";
    if (hour < 16) return "Good Afternoon !";
    return "Good Evening !";
  };

  const handlePosMode = () => {
    router.push("/posuser");
  };

  const baseClasses = "min-h-[200px] w-full bg-white rounded-lg shadow-lg flex flex-col px-3 py-4";
  const mobileClasses = isMobile ? "md:h-full cursor-grab active:cursor-grabbing" : "";
  const combinedClasses = `${baseClasses} ${mobileClasses} ${className}`;

  return (
    <div className={combinedClasses}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800">
            {getGreeting()}
          </h1>
          <h1 className="mt-2 text-gray-600 text-md font-normal">
            Welcome to Sri Renukka Akkama Temple&apos;s official place
          </h1>
        </div>
        {isPosUser ? (
          <div 
            onClick={handlePosMode} 
            className="min-w-16 min-h-16 max-h-16 max-w-16 p-2 flex items-center text-center rounded-md bg-red-500 text-sm text-white font-medium cursor-pointer"
          >
            POS Mode
          </div>
        ) : (
          <div className="text-2xl text-gray-600">
            <FaOm />
          </div>
        )}
      </div>
      <h1 className="mt-4 text-gray-800 font-medium bg-violet-100 p-2 rounded-md">
        &quot;{quote}&quot;
      </h1>
    </div>
  );
}