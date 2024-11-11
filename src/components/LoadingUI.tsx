import { Skeleton } from '@/components/ui/skeleton';

function LoadingUI() {
    return (
        <div className="flex flex-col gap-y-6 mt-10">
            <div className="animate-pulse bg-white shadow-md rounded-lg p-4 lg:w-[700px] md:w-[600px] sm:w-[500px] border border-[#c0c0c0]">
                <div className="flex items-center gap-x-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex flex-col gap-y-2">
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-4 w-24 rounded" />
                    </div>
                </div>
                <Skeleton className="h-48 w-full rounded mb-4" />
                <div className="flex flex-col gap-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-4 w-2/3 rounded" />
                </div>
            </div>
            <div className="animate-pulse bg-white shadow-md rounded-lg p-4 lg:w-[700px] md:w-[600px] sm:w-[500px] border border-[#c0c0c0]">
                <div className="flex items-center gap-x-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex flex-col gap-y-2">
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-4 w-24 rounded" />
                    </div>
                </div>
                <Skeleton className="h-48 w-full rounded mb-4" />
                <div className="flex flex-col gap-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-4 w-2/3 rounded" />
                </div>
            </div>
        </div>
    );
}

export default LoadingUI;
