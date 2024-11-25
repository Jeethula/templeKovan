'use client';

import { useState, useRef, useEffect } from 'react';

interface CarouselWrapperProps {
  children: React.ReactNode[];
}

export function CarouselWrapper({ children }: CarouselWrapperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev === 0 ? 1 : 0));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      setActiveIndex(() => (diff > 0 ? 1 : 0));
    }
  };

  return (
    <div className="relative">
      <div 
        className="relative h-[200px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {children.map((child, index) => (
          <div
            key={index}
            style={{
              transition: 'opacity 0.5s ease-in-out',
              opacity: activeIndex === index ? 1 : 0,
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          >
            {child}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-2 gap-2">
        <div 
          className={`h-1 w-6 rounded-full transition-colors duration-300 ${
            activeIndex === 0 ? 'bg-violet-500' : 'bg-gray-300'
          }`}
        />
        <div 
          className={`h-1 w-6 rounded-full transition-colors duration-300 ${
            activeIndex === 1 ? 'bg-violet-500' : 'bg-gray-300'
          }`}
        />
      </div>
    </div>
  );
}
