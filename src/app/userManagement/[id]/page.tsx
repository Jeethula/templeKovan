"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Pencil, User, Mail, Phone, MapPin, Home, Flag, Building2, ChevronLeft } from 'lucide-react';
import LoadingPageUi from "@/components/LoadingPageUi";
import { PiMapPinFill } from "react-icons/pi";
import { BsWhatsapp } from "react-icons/bs";
import toast from "react-hot-toast";

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
  [key: string]: string | undefined;
}

interface Relationship {
  id: string;
  relation: 'son' | 'daughter';
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Update the Profile interface
interface Profile {
  user: {
    id: string;
    email: string;
    phone: string;
  };
  personalInfo: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    [key: string]: string | undefined;
  };
  relationships: Relationship[];
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

interface EditableSectionProps {
  section: string;
  fields: string[];
  profile: Profile | null;
  onSave: (section: string, updatedData: { [key: string]: string }) => void;
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

  // Update handleEditSubmit function
  const handleEditSubmit = async (section: string, updatedData: { [key: string]: string }) => {
    if (!profile) return;

    const payload = {
      userId: profile.user.id,
      email: updatedData.email || profile.user.email,
      phone: updatedData.phone || profile.user.phone,
      firstName: updatedData.firstName || profile.personalInfo?.firstName,
      lastName: updatedData.lastName || profile.personalInfo?.lastName,
      ...updatedData
    };

    try {
      const response = await fetch('/api/userDetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setProfile(prevProfile => {
          if (!prevProfile) return null;
          return {
            ...prevProfile,
            user: {
              ...prevProfile.user,
              email: updatedData.email || prevProfile.user.email,
              phone: updatedData.phone || prevProfile.user.phone,
            },
            personalInfo: {
              ...prevProfile.personalInfo,
              ...result.userDetails,
            }
          };
        });
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
    const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!sessionData.role?.includes('Admin')) {
      router.push('/unAuthorized');
    }
    fetchData();
  }, []);

  // if (loading) return <div className="text-center mt-10"><LoadingPageUi /></div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  const getChanges = (current: Profile | HistoryItem, previous: Profile | HistoryItem): Change[] => {
    const changes: Change[] = [];
    const personalInfoFields = ['salutation', 'firstName', 'lastName', 'phoneNumber', 'address1', 'address2', 'city', 'pincode', 'state', 'country', 'avatarUrl', 'comments'];

    personalInfoFields.forEach(field => {
      const currentValue = (current as HistoryItem)[field] || (current as Profile).personalInfo?.[field];
      const previousValue = (previous as HistoryItem)[field] || (previous as Profile).personalInfo?.[field];
      
      if (currentValue !== previousValue) {
        changes.push({ field, from: previousValue, to: currentValue });
      }
    });

    return changes;
  };

  // const ChangeHistoryItem = ({ change }: { change: Change }) => (
  //   <p className="text-gray-700">
  //     <span className="font-medium">{change.field}:</span> {JSON.stringify(change.from)} → {JSON.stringify(change.to)}
  //   </p>
  // );

  const EditableSection = ({ section, fields, profile, onSave }: EditableSectionProps) => {
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

    // Update the getValue function in EditableSection
    const getValue = (field: string) => {
      if (!profile) return '';
      
      // Handle email and phone separately since they're in user object
      if (field === 'email') {
        return profile.user?.email || '';
      }
      if (field === 'phone') {
        return profile.user?.phone || '';
      }
      
      // Handle personal info fields
      return profile.personalInfo?.[field]?.toString() || '';
    };

    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-4 sm:mb-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center text-[#663399] mr-4">
            {section === 'personalInfo' ? (
              'Personal Information'
            ) : (
              <>
                <PiMapPinFill className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="currentColor" />
                Address Information
              </>
            )}
          </h3>
          {Object.keys(editedValues).length === 0 && (
            <button 
              onClick={() => setEditedValues(Object.fromEntries(
                fields.map(field => [field, getValue(field)])
              ))} 
              className="text-blue-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {Object.keys(editedValues).length > 0 ? (
          <>
            {fields.map(field => (
              <div key={field} className="mb-3">
                <input
                  type="text"
                  id={field}
                  ref={(el: HTMLInputElement | null) => { inputRefs.current[field] = el; }}
                  value={editedValues[field] || getValue(field)}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#663399] focus:border-transparent
                    transition-shadow"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setEditedValues({})} 
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 
                  text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 
                  focus:ring-offset-2"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700 
                  text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 
                  focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            {fields.map(field => (
              <p key={field} className="flex items-center text-sm sm:text-base text-gray-700 py-1">
                {getIcon(field)}
                {field === 'phone' ? (
                  <span className="flex items-center gap-2">
                    <a
                      href={`tel:${formatPhoneNumber(getValue(field))}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {getValue(field)}
                    </a>
                    <a
                      href={`https://wa.me/${formatPhoneNumber(getValue(field))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 p-1 hover:bg-green-50 rounded-full transition-colors"
                    >
                      <BsWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  </span>
                ) : (
                  <span className="ml-2">{getValue(field)}</span>
                )}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const RelationshipsSection = ({ relationships }: { relationships: Relationship[] }) => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-[#663399] mb-4">Family Members</h3>
        
        {relationships.length === 0 ? (
          <p className="text-gray-600">No family members added</p>
        ) : (
          <div className="space-y-4">
            {relationships.map((relation) => (
              <div 
                key={relation.id} 
                className="p-4 bg-[#fdf0f4] rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#663399] capitalize">
                    {relation.firstName} {relation.lastName}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {relation.relation}
                  </p>
                </div>
                {relation.phone && (
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${formatPhoneNumber(relation.phone)}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Phone size={18} />
                    </a>
                    <a
                      href={`https://wa.me/${formatPhoneNumber(relation.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                    >
                      <BsWhatsapp size={18} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf0f4] to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.push('/userManagement')}
            className="group flex items-center text-[#663399] hover:text-[#663399]/80 
              transition-colors mb-4 text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Users</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#663399]">User Profile</h1>
        </div>

        {loading ? (
          <LoadingPageUi />
        ) : profile ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Personal Information Section */}
            <EditableSection
              section="personalInfo"
              fields={[
                'email',
                'phone',
                'firstName',
                'lastName'
              ]}
              profile={profile}
              onSave={(section, values) => {
                handleEditSubmit(section, {
                  email: values.email,
                  phone: values.phone,
                  firstName: values.firstName,
                  lastName: values.lastName
                });
              }}
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

            {/* Add the new RelationshipsSection */}
            <RelationshipsSection relationships={profile.relationships || []} />

            {/* History Section remains the same */}
            <div className="bg-white rounded-xl shadow-md border border-[#663399]/20 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#663399] mb-4 sm:mb-6">
                Profile History
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {history.length === 0 ? (
                  <p className="text-gray-600 text-sm sm:text-base">No changes recorded</p>
                ) : (
                  history.map((historyItem, index) => {
                    const previousProfile = index > 0 ? history[index - 1] : profile;
                    const changes = getChanges(historyItem, previousProfile as HistoryItem | Profile);
                    return (
                      <div key={index} className="p-3 sm:p-4 bg-[#fdf0f4] rounded-lg">
                        <p className="text-xs sm:text-sm font-medium text-[#663399] mb-2">
                          {historyItem.createdAt ? 
                            new Date(historyItem.createdAt).toLocaleString() : 
                            'Date not available'}
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
          <div className="text-center text-red-500 text-sm sm:text-base">Profile not found</div>
        )}
      </div>
    </div>
  );
}