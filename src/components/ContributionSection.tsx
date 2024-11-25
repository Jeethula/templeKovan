'use client';
import { FaHandHoldingHeart, FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ContributionSection() {
  const router = useRouter();

  return (
    <div className="h-full" onClick={() => router.push("/contributions")}>
      <div className="bg-violet-500 rounded-xl p-6 h-full">
        <div className="flex flex-col items-center gap-2">
          <div className="flex-1 text-white">
            <div className="flex items-center gap-3 mb-4">
              <FaHandHoldingHeart className="text-3xl" />
              <h2 className="text-xl font-semibold">
                Together make a difference
              </h2>
            </div>
            <p className="mb-4 text-lg opacity-90">
              Even a small amount can help, as it can make a big impact
              in many ways
            </p>
            <button className="bg-white text-violet-600 px-6 py-2 rounded-full font-bold hover:bg-purple-700 hover:text-white transition-colors flex items-center gap-2">
              <FaUsers />
              Contribute now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}