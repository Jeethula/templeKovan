import { Skeleton } from "@/components/ui/skeleton";

export const WelcomeCardSkeleton = () => (
  <div className="min-h-[200px] w-full bg-white rounded-lg shadow-lg flex flex-col px-3 py-4">
    <div className="flex justify-between">
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
    <Skeleton className="mt-4 h-24 w-full" />
  </div>
);

export const SpecialEventsCardSkeleton = () => (
  <div className="min-h-[200px] w-full rounded-lg shadow-lg bg-[#FFD700]/20 p-4">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
    <Skeleton className="h-24 w-full rounded-lg mb-4" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full" />
  </div>
);

export const ContributionSectionSkeleton = () => (
  <div className="h-full">
    <div className="bg-violet-500/20 rounded-xl p-6 h-full">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  </div>
);

export const SevaCardsSkeleton = () => (
  <>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex-none w-64 md:w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <Skeleton className="h-32 w-full" />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    ))}
  </>
);