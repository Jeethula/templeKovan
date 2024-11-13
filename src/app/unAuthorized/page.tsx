"use client";

import { ArrowLeft, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Page() {
    const router = useRouter();

    return (
        <div className="min-h-screen min-w-screen bg-[#f5f0ff] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 mx-auto text-center">
                {/* Error Icon */}
                <div className="mb-6">
                    <svg
                        className="mx-auto h-24 w-24 text-[#663399]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                {/* Error Message */}
                <h1 className="text-2xl md:text-3xl font-bold text-[#663399] mb-4">
                    You are not Authorized
                </h1>
                <p className="text-gray-600 mb-8">
                    Sorry, you don&apos;t have permission to access this page. Please contact the administrator or go back.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                    <button
                        onClick={() => window.location.href = 'mailto:admin@example.com'}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#663399] hover:bg-[#552288] text-white rounded-lg transition-colors duration-200"
                    >
                        <Mail size={20} />
                        Contact Admin
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Page;