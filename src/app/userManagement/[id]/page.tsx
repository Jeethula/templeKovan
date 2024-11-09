"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Pencil, User, Mail, Phone, MapPin, Home, Flag, Building2, ChevronLeft } from 'lucide-react';
import LoadingPageUi from "@/components/LoadingPageUi";
import { PiMapPinFill } from "react-icons/pi";
import { toast } from 'react-toastify';
import { BsWhatsapp } from "react-icons/bs";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    personalInfo: {
      firstName: string;
      avatarUrl: string;
    };
  };
  likes: number;
  comments: any[];
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
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
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

const formatPhoneNumber = (phone: string) => {
  // Remove any non-numeric characters
  return phone.replace(/\D/g, '');
};

export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<PersonalInfo & { user?: Partial<User> }>>({});

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
          ...updatedData,
          uniqueId: profile.personalInfo?.uniqueId ?? 0,
          isApproved: profile.personalInfo?.isApproved ?? "pending",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setProfile(prevProfile => ({
          ...(prevProfile ?? {}),
          ...updatedData,
          personalInfo: { ...(prevProfile?.personalInfo ?? {}), ...result.userDetails },
          user: { ...(prevProfile?.user ?? {}), ...result.user },
        }));
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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

  // const ChangeHistoryItem = ({ change }: { change: Change }) => (
  //   <p className="text-gray-700">
  //     <span className="font-medium">{change.field}:</span> {JSON.stringify(change.from)} → {JSON.stringify(change.to)}
  //   </p>
  // );

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
             
              <button onClick={() => setEditedValues({})} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg mr-2">
                Cancel
              </button>
              <button onClick={handleSave} className="bg-green-600 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-lg ">
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            {fields.map(field => (
              <p key={field} className="text-gray-700 mb-2 flex items-center">
                {getIcon(field)}
                {field === 'phone' ? (
                  <span className="flex items-center gap-2">
                    <a
                      href={`tel:${formatPhoneNumber(getValue(field))}`}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {getValue(field)}
                    </a>
                    <a
                      href={`https://wa.me/${formatPhoneNumber(getValue(field))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                      title="Chat on WhatsApp"
                    >
                      <BsWhatsapp size={20} />
                    </a>
                  </span>
                ) : (
                  getValue(field)
                )}
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
            {/* Personal Information Section */}
            <EditableSection
              section="personalInfo"
              fields={[
                'firstName',
                'lastName',
                'email',
                'phone'
              ]}
              profile={profile}
              onSave={handleEditSubmit}
            />

            {/* Address Information Section */}
            <EditableSection
              section="address"
              fields={[
                'address1',
                'address2',
                'city',
                'state',
                'pincode',
                'country'
              ]}
              profile={profile}
              onSave={handleEditSubmit}
            />

            {/* History Section remains the same */}
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
                          {historyItem.createdAt ? new Date(historyItem.createdAt).toLocaleString() : 'Date not available'}
                        </p>
                        {changes.map((change, idx) => (
                          <p key={idx} className="text-gray-700">
                            Changed <span className="font-medium">{change.field}</span> 
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