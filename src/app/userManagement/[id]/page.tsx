"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, MapPin, Phone, Mail, FileText, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import LoadingPageUi from "@/components/LoadingPageUi";


export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
  const adminEmail:string=sessionData.email
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
        body: JSON.stringify({ email:profile.email, isApproved:status,adminEmail:adminEmail }),
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

  if (loading) return <div className="text-center mt-10"><LoadingPageUi/></div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-[#f4f4f4] rounded-xl shadow-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">User Profile</h1>
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6">
              <Image 
                src={profile.avatarUrl || '/api/placeholder/160/160'}
                alt="User profile picture"
                layout="fill"
                className="rounded-full object-cover shadow-lg border-4 border-white"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{`${profile.firstName} ${profile.lastName}`}</h2>
            <p className="text-gray-600 mb-4 flex items-center">
              <Mail size={18} className="mr-2 text-blue-500" />
              {profile.email}
            </p>
            <p className="text-gray-600 flex items-center">
              <Phone size={18} className="mr-2 text-green-500" />
              {profile.phoneNumber || "N/A"}
            </p>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin size={24} className="mr-2 text-red-500" />
                Address Information
              </h3>
              <p className="text-gray-700">{profile.address1}</p>
              {profile.address2 && <p className="text-gray-700">{profile.address2}</p>}
              <p className="text-gray-700">{`${profile.city}, ${profile.state}`}</p>
              <p className="text-gray-700">{`${profile.country}, ${profile.pincode}`}</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <User size={24} className="mr-2 text-blue-500" />
                User Activity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FileText size={20} className="mr-2 text-indigo-500" />
                  <p className="text-gray-700"><span className="font-medium">Posts:</span> {profile.user.posts?.length || 0}</p>
                </div>
                <div className="flex items-center">
                  <ThumbsUp size={20} className="mr-2 text-green-500" />
                  <p className="text-gray-700"><span className="font-medium">Liked:</span> {profile.user.likedPosts?.length || 0}</p>
                </div>
                <div className="flex items-center">
                  <ThumbsDown size={20} className="mr-2 text-red-500" />
                  <p className="text-gray-700"><span className="font-medium">Disliked:</span> {profile.user.dislikedPosts?.length || 0}</p>
                </div>
                <div className="flex items-center">
                  <MessageSquare size={20} className="mr-2 text-yellow-500" />
                  <p className="text-gray-700"><span className="font-medium">Comments:</span> {profile.comments?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-10 flex justify-center space-x-6">
        <button
          className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
          onClick={() => updateApprovalStatus("approved")}
        >
          Accept
        </button>
        <button
          className="px-8 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
          onClick={() => updateApprovalStatus("rejected")}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
