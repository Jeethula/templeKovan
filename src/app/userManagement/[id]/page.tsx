"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Backpack, MessageSquare, MessageSquareOff, UserCircle2} from 'lucide-react';
import LoadingPageUi from "@/components/LoadingPageUi";
import { PiMapPinFill, PiThumbsDownFill, PiThumbsUpFill } from "react-icons/pi";
import { RiMailFill } from "react-icons/ri";
import { BsFileTextFill, BsPhoneFill, BsTrash2Fill } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUserXmark } from "react-icons/fa6";
import { FaUserCheck, FaUserFriends, FaUserTimes } from "react-icons/fa";

export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
  const adminEmail: string = sessionData.email;
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id }),
      });
      const data = await res.json();
      if (data.status === 200) {
        setProfile(data.details);
      } else {
        setError("User profile not found");
      }
      setLoading(false);
    } catch (e) {
      setError("An error occurred while fetching the profile");
      setLoading(false);
    }
  };

  const updateApprovalStatus = async (status: string) => {
    try {
      const res = await fetch('/api/userDetails', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, isApproved: status, adminEmail: adminEmail }),
      });
      const result = await res.json();
      if (result.success) {
        router.push('/userManagement');
      }
    } catch (e) {
      setError("An error occurred while updating the status");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-10"><LoadingPageUi /></div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="w-full min-w-screen h-full min-h-screen p-4 sm:p-8 bg-[#fdf0f4] rounded-xl">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <button
          className="text-orange-600 hover:underline flex text-xl items-center"
          onClick={() => router.push('/userManagement')}
        >
          <IoMdArrowRoundBack size={20} className="mr-2" fill="currentColor" />
          Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-[#663399] flex items-center gap-x-2">User Profile</h1>
      </div>
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1 flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
            <div className="relative w-32 h-32 mb-6">
              <Image
                src={profile.avatarUrl || '/api/placeholder/160/160'}
                alt="User profile picture"
                layout="fill"
                className="rounded-full object-cover shadow-lg border-4 border-[#663399]"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#663399] mb-2">{`${profile.firstName} ${profile.lastName}`}</h2>
            <p className="text-gray-600 mb-4 flex items-center">
              <RiMailFill size={18} className="mr-2 text-[#663399]" fill="currentColor" />
              {profile.email}
            </p>
            <p className="text-gray-600 flex items-center">
              <BsPhoneFill size={18} className="mr-2 text-[#663399]" fill="currentColor" />
              {profile.phoneNumber || "N/A"}
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-[#663399]">
                <PiMapPinFill size={24} className="mr-2" fill="currentColor" />
                Address Information
              </h3>
              <p className="text-gray-700">{profile.address1}</p>
              {profile.address2 && <p className="text-gray-700">{profile.address2}</p>}
              <p className="text-gray-700">{`${profile.city}, ${profile.state}`}</p>
              <p className="text-gray-700">{`${profile.country}, ${profile.pincode}`}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-[#663399]">
                <UserCircle2 size={24} className="mr-2" fill="currentColor" />
                User Activity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <BsFileTextFill size={20} className="mr-2 text-[#663399]" fill="currentColor" />
                  <p className="text-gray-700"><span className="font-medium">Posts:</span> {profile.user.posts?.length || 0}</p>
                </div>
                <div className="flex items-center">
                  <PiThumbsUpFill size={20} className="mr-2 text-[#663399]" fill="currentColor" />
                  <p className="text-gray-700"><span className="font-medium">Liked:</span> {profile.user.likedPosts?.length || 0}</p>
                </div>
                <div className="flex items-center">
                  <PiThumbsDownFill size={20} className="mr-2 text-[#663399]" fill="currentColor" />
                  <p className="text-gray-700"><span className="font-medium">Disliked:</span> {profile.user.dislikedPosts?.length || 0}</p>
                </div>
                <div className="flex items-center">
                  <MessageSquare size={20} className="mr-2 text-[#663399]" fill="currentColor" />
                  <p className="text-gray-700"><span className="font-medium">Comments:</span> {profile.comments?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        {profile.isApproved === "approved" ? (
          <button
            className="w-full sm:w-auto px-8 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center"
            onClick={()=>updateApprovalStatus("rejected")}
          >
            <FaUserXmark  size={18} className="mr-2" fill="currentColor" />
            Reject
          </button>
        ) : (
          <>
            <button
              className="w-full flex items-center gap-x-3 sm:w-auto px-8 py-3 bg-[#663399] text-white font-semibold rounded-lg shadow-lg hover:bg-[#5a2d8a] transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={() => updateApprovalStatus("approved")}
            >
            <FaUserCheck />
            Accept
            </button>
            <button
              className="w-full flex items-center gap-x-3 sm:w-auto px-8 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={() => updateApprovalStatus("rejected")}
            >
              <FaUserTimes />
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}