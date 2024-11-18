import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react"; // Add this import
import { useRouter } from "next/navigation";

interface SearchHeaderProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  resultsCount: number;
}

export function SearchHeader({
  searchTerm,
  onSearch,
  resultsCount,
}: SearchHeaderProps) {
  const router = useRouter();
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        {/* Desktop header */}
        <div className="hidden sm:flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-[#663399]" />
            <h1 className="text-xl sm:text-2xl font-semibold text-[#663399]">
              Manage Users
            </h1>
          </div>
          <Button
            onClick={() => router.push("/add")}
            className="bg-[#663399] hover:bg-[#663399]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Mobile and desktop search */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full px-4 py-2.5 border border-[#663399]/20 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-[#663399]/20
                       transition-all duration-200 ease-in-out
                       text-sm sm:text-base"
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            {resultsCount} {resultsCount === 1 ? "result" : "results"} found
          </p>
        </div>

        {/* Mobile-only button */}
        <div className="sm:hidden">
          <Button
            onClick={() => router.push("/add")}
            className="bg-[#663399] hover:bg-[#663399]/90 w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>
    </div>
  );
}
