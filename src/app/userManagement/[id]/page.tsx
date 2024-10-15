"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MessageSquare, UserCircle2, Edit, X } from 'lucide-react';
import LoadingPageUi from "@/components/LoadingPageUi";
import { PiMapPinFill, PiThumbsDownFill, PiThumbsUpFill } from "react-icons/pi";
import { RiMailFill } from "react-icons/ri";
import { BsFileTextFill, BsPhoneFill } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import { FaUserCheck, FaUserFriends, FaUserTimes } from "react-icons/fa";

interface Post {
  posts: Post[];
}

interface User {
  email: string;
  phone: string;
  posts: Post[];
  likedPosts: Post[];
  dislikedPosts: Post[];
}

interface Profile {
  email: string;
  user: User;
  [key: string]: string | User;
}

interface HistoryItem {
  updatedAt: string;
  [key: string]: string;
}

interface Change {
  field: string;
  from: string | User;
  to: string | User;
}

export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
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
        setEditedProfile(data.details);
        fetchHistory(data.details.email);
      } else {
        setError("User profile not found");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred while fetching the profile");
      setLoading(false);
    }
  };

  const fetchHistory = async (email: string) => {
    try {
      const res = await fetch('/api/profilehistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.status === 200) {
        setHistory(data.details);
      } else {
        setError("User history not found");
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError("An error occurred while fetching the history");
      setLoading(false);
    }
  };

  const updateApprovalStatus = async (status: string) => {
    if(status === "rejected"){
      if (!window.confirm("Are you sure you want to reject this user?")) {
        return;
      }
    }
    try {
      const res = await fetch('/api/userDetails', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile?.email, isApproved: status, adminEmail: adminEmail }),
      });
      const result = await res.json();
      if (result.success) {
        setProfile(prev => prev ? {...prev, isApproved: status} : null);
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred while updating the status");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editedProfile, id: params.id }),
      });
      console.log(editedProfile,"editedProfile");
      const result = await res.json();
      console.log(result,"result");
      if (result.success) {
        setProfile(editedProfile);
        setIsEditModalOpen(false);
        fetchData(); 
      } else {
        setError("Failed to update profile");
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred while updating the profile");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-10"><LoadingPageUi /></div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  const getChanges = (current: Profile, previous: HistoryItem): Change[] => {
    const changes: Change[] = [];
    const personalInfoFields = ['salutation', 'firstName', 'lastName', 'email', 'phoneNumber', 'address1', 'address2', 'city', 'pincode', 'state', 'country', 'avatarUrl', 'comments', 'isApproved'];

    personalInfoFields.forEach(field => {
      if (current[field] !== previous[field]) {
        changes.push({ field, from: previous[field], to: current[field] });
      }
    });

    return changes;
  };

  const ChangeHistoryItem = ({ change }: { change: Change }) => (
    <p className="text-gray-700">
      <span className="font-medium">{change.field}:</span> {JSON.stringify(change.from)} → {JSON.stringify(change.to)}
    </p>
  );

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
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-red-500 flex items-center gap-x-2"><FaCircleUser />User Profile</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Edit size={20} className="mr-2" />
          Edit Profile
        </button>
      </div>
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1 flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
            <div className="relative w-32 h-32 mb-6">
              <Image
                src={typeof profile?.avatarUrl === 'string' ? profile.avatarUrl : '/api/placeholder/160/160'}
                alt="User profile picture"
                layout="fill"
                className="rounded-full object-cover shadow-lg border-4 border-[#663399]"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#663399] mb-2">{`${profile.firstName} ${profile.lastName}`}</h2>
            <p className="text-gray-600 mb-4 flex items-center">
              <RiMailFill size={18} className="mr-2 text-[#663399]" fill="currentColor" />
              {profile.user.email}
            </p>
            <p className="text-gray-600 flex items-center">
              <BsPhoneFill size={18} className="mr-2 text-[#663399]" fill="currentColor" />
              {typeof profile?.user.phone === 'string' ? profile.user.phone : "N/A"}
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-[#663399]">
                <PiMapPinFill size={24} className="mr-2" fill="currentColor" />
                Address Information
              </h3>
              <p className="text-gray-700">{typeof profile.address1 === 'string' ? profile.address1 : ''}</p>
              {typeof profile.address2 === 'string' && <p className="text-gray-700">{profile.address2}</p>}
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
                  <p className="text-gray-700"><span className="font-medium">Posts:</span> {profile.user?.posts?.length || 0}</p>
                </div>
                <div className="flex items-center">
                  <PiThumbsUpFill size={20} className="mr-2 text-[#663399]" fill="currentColor" />
                  <p className="text-gray-700"><span className="font-medium">Liked:</span> {profile.user?.likedPosts?.length || 0}</p>
                </div>
                <div className="flex items-center">
                  <PiThumbsDownFill size={20} className="mr-2 text-[#663399]" fill="currentColor" />
                  <p className="text-gray-700"><span className="font-medium">Disliked:</span> {profile.user?.dislikedPosts?.length || 0}</p>
                </div>
                <div className="flex items-center">
                  <MessageSquare size={20} className="mr-2 text-[#663399]" fill="currentColor" />
                  <p className="text-gray-700"><span className="font-medium">Comments:</span> {typeof profile.comments === 'string' ? profile.comments.length : 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        {profile?.isApproved === "approved" ? (
          <div className="text-green-500 font-semibold">User Accepted</div>
        ) : profile?.isApproved === "rejected" ? (
          <div className="text-red-500 font-semibold">User Rejected</div>
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

      <div className="mt-8 sm:mt-10">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-[#663399]">
          <FaUserFriends size={24} className="mr-2" fill="currentColor" />
          Changes History
        </h3>
        {history.length === 0 &&  <p className="text-gray-700">No changes found</p>}
        {history.map((historyItem, index) => {
          const changes = profile ? getChanges(profile, historyItem) : [];
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg mb-4">
              <h4 className="text-md sm:text-lg font-semibold mb-2 text-[#663399]">
                {new Date(historyItem.updatedAt).toLocaleString()}
              </h4>
              {changes.map((change, idx) => (
                <ChangeHistoryItem key={idx} change={change} />
              ))}
            </div>
          );
        })}
      </div>

      {isEditModalOpen && editedProfile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full m-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Edit User Profile</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                {Object.entries(editedProfile).map(([key, value]) => {
                  if (typeof value === 'string' && key !== 'email') {
                    return (
                      <div key={key} className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <input 
                          type="text"
                          id={key}
                          name={key}
                          value={value}
                          onChange={(e) => setEditedProfile(prev => {
                            if (prev === null) return null;
                            return { ...prev, [key]: e.target.value };
                          })}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                    );
                  }
                  return null;
                })}
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <Edit size={20} className="mr-2" />
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


