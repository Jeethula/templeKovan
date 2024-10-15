"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MessageSquare, UserCircle2, Pencil, User, Mail, Phone, MapPin, Home, Flag } from 'lucide-react';
import LoadingPageUi from "@/components/LoadingPageUi";
import { PiMapPinFill, PiThumbsDownFill, PiThumbsUpFill } from "react-icons/pi";
import { BsFileTextFill } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import { FaCity, FaUserCheck, FaUserFriends, FaUserTimes } from "react-icons/fa";

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

  const handleEditSubmit = async (section: string, values: {[key: string]: string}) => {
    if (!profile) return;
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, ...values }),
      });
      const result = await res.json();
      if (result.success) {
        setProfile(prev => prev ? {...prev, ...values} : null);
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

  const EditableSection = ({ section, fields, profile, onSave }: { section: string, fields: string[], profile: Profile, onSave: (section: string, values: {[key: string]: string}) => void }) => {
    const [editedValues, setEditedValues] = useState<{[key: string]: string}>({});
    const inputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

    const handleInputChange = useCallback((field: string, value: string) => {
      setEditedValues(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSave = useCallback(() => {
      onSave(section, editedValues);
      setEditedValues({});
    }, [section, editedValues, onSave]);

    const getIcon = (field: string) => {
      switch (field) {
        case 'firstName':
        case 'lastName':
          return <User size={18} className="mr-2" />;
        case 'email':
          return <Mail size={18} className="mr-2" />;
        case 'phone':
          return <Phone size={18} className="mr-2" />;
        case 'address1':
        case 'address2':
          return <Home size={18} className="mr-2" />;
        case 'city':
          return <FaCity size={18} className="mr-2" />;
        case 'state':
        case 'country':
          return <Flag size={18} className="mr-2" />;
        case 'pincode':
          return <MapPin size={18} className="mr-2" />;
        default:
          return null;
      }
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold flex items-center text-[#663399] mr-4">
            {section === 'personalInfo' ? (
              <>
                <FaCircleUser size={24} className="mr-2" />
                Personal Information
              </>
            ) : (
              <>
                <PiMapPinFill size={24} className="mr-2" fill="currentColor" />
                Address Information
              </>
            )}
          </h3>
          {Object.keys(editedValues).length === 0 && (
            <button 
              onClick={() => setEditedValues(Object.fromEntries(
                Object.entries(profile).filter(([_, v]) => typeof v === 'string') as [string, string][]
              ))} 
              className="text-blue-500 hover:text-blue-600 flex-shrink-0"
            >
              <Pencil size={20} />
            </button>
          )}
        </div>
        {Object.keys(editedValues).length > 0 ? (
          <>
            {fields.map(field => (
              <div key={field} className="mb-4">
                <input
                  type="text"
                  id={field}
                  ref={(el: HTMLInputElement | null) => { inputRefs.current[field] = el; }}
                  value={editedValues[field] || profile[field]?.toString() || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
                Save
              </button>
              <button onClick={() => setEditedValues({})} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {fields.map(field => (
              <p key={field} className="text-gray-700 mb-2 flex items-center">
                {getIcon(field)}
                {profile[field]?.toString() || ''}
              </p>
            ))}
          </>
        )}
      </div>
    );
  };

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
      </div>
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-6">
              <Image
                src='https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='
                alt="User avatar"
                layout="fill"
                className="rounded-full object-cover shadow-lg bg-none"
              />
            </div>
            <EditableSection 
              section="personalInfo" 
              fields={['firstName', 'lastName', 'email', 'phone']} 
              profile={profile}
              onSave={handleEditSubmit}
            />
          </div>

          <div className="lg:col-span-2">
            <EditableSection 
              section="addressInfo" 
              fields={['address1', 'address2', 'city', 'state', 'country', 'pincode']} 
              profile={profile}
              onSave={handleEditSubmit}
            />

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
    </div>
  );
}