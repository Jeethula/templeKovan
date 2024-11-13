"use client"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen min-w-screen bg-[#f5f0ff] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 mx-auto text-center">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-4">
          Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Could not find the requested resource. Please check the URL or go back to home.
        </p>

        {/* Action Button */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#663399] hover:bg-[#552288] text-white rounded-lg transition-colors duration-200 inline-block"
        >
          <ArrowLeft size={20} />
          Return Home
        </Link>
      </div>
    </div>
  )
}