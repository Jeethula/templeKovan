"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MessageSquare, UserCircle2, Pencil, User, Mail, Phone, MapPin, Home, Flag, Building2, ChevronLeft } from 'lucide-react';
import LoadingPageUi from "@/components/LoadingPageUi";
import { PiMapPinFill, PiThumbsDownFill, PiThumbsUpFill } from "react-icons/pi";
import { BsFileTextFill } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import {  FaUserFriends } from "react-icons/fa";

interface Post {
  posts: Post[];
}

interface User {
  id: string;
  email: string;
  phone: string;
  posts: Post[];
  likedPosts: Post[];
  dislikedPosts: Post[];
}

interface PersonalInfo {
  uniqueId?: string;
  isApproved?: string;
}

interface Profile {
  user: User;
  personalInfo: PersonalInfo;
  [key: string]: string | User | PersonalInfo;
}

interface HistoryItem {
  updatedAt: string;
  [key: string]: string;
}

interface Change {
  field: string;
  from: string | User | PersonalInfo | undefined;
  to: string | User | PersonalInfo | undefined;
}

export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        fetchHistory(data.details.id);
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

  const fetchHistory = async (personalInfoId: string) => {
    try {
      const res = await fetch('/api/profilehistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personalInfoId }),
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

  const handleEditSubmit = async (section: string, updatedData: Partial<Profile>) => {
    if (!profile) return;

    try {
      const response = await fetch('/api/userDetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: profile.user?.id,
          ...(profile.personalInfo && typeof profile.personalInfo === 'object' ? profile.personalInfo : {}),
          ...(profile.user && typeof profile.user === 'object' ? profile.user : {}),
          ...updatedData,
          phone: updatedData.phone ?? profile.user?.phone,
          email: updatedData.email ?? profile.user?.email,
          uniqueId: profile.personalInfo?.uniqueId ?? 0,
          isApproved: profile.personalInfo?.isApproved ?? "pending",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result.success);
        setProfile(prevProfile => ({
          ...(prevProfile ?? {}),
          personalInfo: { ...(prevProfile?.personalInfo ?? {}), ...result.userDetails },
          user: { ...(prevProfile?.user ?? {}), ...result.user },
        }));
        window.location.reload();
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-10"><LoadingPageUi /><p>Loading user profile...</p></div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  const getChanges = (current: Profile | HistoryItem, previous: Profile | HistoryItem): Change[] => {
    const changes: Change[] = [];
    const personalInfoFields = ['salutation', 'firstName', 'lastName', 'phoneNumber', 'address1', 'address2', 'city', 'pincode', 'state', 'country', 'avatarUrl', 'comments'];

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
          return <Building2  size={18} className="mr-2" />;
        case 'state':
        case 'country':
          return <Flag size={18} className="mr-2" />;
        case 'pincode':
          return <MapPin size={18} className="mr-2" />;
        default:
          return null;
      }
    };

    const getValue = (field: string) => {
      if (field === 'email' || field === 'phone') {
        return profile.user?.[field] || '';
      }
      return profile[field]?.toString() || '';
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold flex items-center text-[#663399] mr-4">
            {section === 'personalInfo' ? (
              <>
                {/* <FaCircleUser size={24} className="mr-2" /> */}
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
                fields.map(field => [field, getValue(field)])
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
                  value={editedValues[field] || getValue(field)}
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
                {getValue(field)}
              </p>
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf0f4] to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <button
            onClick={() => router.push('/userManagement')}
            className="group flex items-center text-[#663399] hover:text-[#663399]/80 transition-all duration-300 mb-6"
          >
            <ChevronLeft className="h-5 w-5 mr-1 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-lg">Back to Users</span>
          </button>
          <h1 className="text-3xl font-bold text-[#663399]">User Profile</h1>
        </div>

        {loading ? (
          <LoadingPageUi />
        ) : profile ? (
          <div className="space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-md border border-[#663399]/20 p-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#663399]">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-lg font-medium text-gray-900">
                        {typeof profile.firstName === 'string' ? profile.firstName : ''} {typeof profile.lastName === 'string' ? profile.lastName : ''}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-lg text-gray-900">{profile.user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-lg text-gray-900">{profile.user?.phone}</p>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-lg text-gray-900">{typeof profile.address1 === 'string' ? profile.address1 : ''}</p>
                      <p className="text-lg text-gray-900">{typeof profile.address2 === 'string' ? profile.address2 : ''}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-lg text-gray-900">
                        {typeof profile.city === 'string' ? profile.city : ''}, {typeof profile.state === 'string' ? profile.state : ''} {typeof profile.pincode === 'string' ? profile.pincode : ''}
                      </p>
                      <p className="text-lg text-gray-900">{typeof profile.country === 'string' ? profile.country : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => handleEditSubmit('personalInfo', {})}
                  className="mt-6 w-full sm:w-auto px-6 py-3 bg-[#663399] text-white rounded-xl
                           hover:bg-[#663399]/90 transition-colors duration-200"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Activity Stats Card */}
            <div className="bg-white rounded-2xl shadow-md border border-[#663399]/20 p-8">
              <h2 className="text-2xl font-semibold text-[#663399] mb-6">Activity Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-[#fdf0f4] rounded-xl">
                  <p className="text-2xl font-bold text-[#663399]">{profile.user?.posts?.length || 0}</p>
                  <p className="text-gray-600">Posts</p>
                </div>
                <div className="text-center p-4 bg-[#fdf0f4] rounded-xl">
                  <p className="text-2xl font-bold text-[#663399]">{profile.user?.likedPosts?.length || 0}</p>
                  <p className="text-gray-600">Likes</p>
                </div>
                <div className="text-center p-4 bg-[#fdf0f4] rounded-xl">
                  <p className="text-2xl font-bold text-[#663399]">{profile.user?.dislikedPosts?.length || 0}</p>
                  <p className="text-gray-600">Dislikes</p>
                </div>
                <div className="text-center p-4 bg-[#fdf0f4] rounded-xl">
                  <p className="text-2xl font-bold text-[#663399]">{typeof profile.comments === 'string' ? profile.comments.length : 0}</p>
                  <p className="text-gray-600">Comments</p>
                </div>
              </div>
            </div>

            {/* History Card */}
            <div className="bg-white rounded-2xl shadow-md border border-[#663399]/20 p-8">
              <h2 className="text-2xl font-semibold text-[#663399] mb-6">Profile History</h2>
              <div className="space-y-4">
                {history.length === 0 ? (
                  <p className="text-gray-600">No changes recorded</p>
                ) : (
                  history.map((historyItem, index) => {
                    const previousProfile = index > 0 ? history[index - 1] : profile;
                    const changes = getChanges(historyItem, previousProfile as HistoryItem | Profile);
                    return (
                      <div key={index} className="p-4 bg-[#fdf0f4] rounded-xl">
                        <p className="text-sm font-medium text-[#663399] mb-2">
                          {new Date(historyItem.updatedAt).toLocaleString()}
                        </p>
                        {changes.map((change, idx) => (
                          <p key={idx} className="text-gray-700">
                            Changed <span className="font-medium">{change.field}</span> from{' '}
                            {JSON.stringify(change.from)} to {JSON.stringify(change.to)}
                          </p>
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500">Profile not found</div>
        )}
      </div>
    </div>
  );
}