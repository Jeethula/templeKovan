"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";import { useRouter } from "next/navigation";
import {  User, Mail, Phone, MapPin, Home, Flag, Building2, ChevronLeft } from 'lucide-react';
import LoadingPageUi from "@/components/LoadingPageUi";
import { PiMapPinFill } from "react-icons/pi";
import { BsWhatsapp } from "react-icons/bs";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Common Components (same as UserDetailsForm.tsx)
const FloatingInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return <Input placeholder=" " className={cn('peer', className)} ref={ref} {...props} />;
  },
);
FloatingInput.displayName = 'FloatingInput';

// FloatingLabel component (same as before)
const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      className={cn(
        'peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-2...',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = 'FloatingLabel';

// FloatingLabelInput and other components (same as before)

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
    id: string;
    email: string;
    phone: string;

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

// First, update the EditableSectionProps interface to include a new ref
interface EditableSectionProps {
  section: string;
  fields: string[];
  profile: Profile | null;
  isEditing: boolean;
  editedValues: {[key: string]: string};
  onInputChange: (field: string, value: string) => void;
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
  const [editedValues, setEditedValues] = useState<{[key: string]: string}>({});

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
      userId: profile.id,
      email: updatedData.email || profile.email,
      phone: updatedData.phone || profile.phone,
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
              ...prevProfile,
              email: updatedData.email || prevProfile.email,
              phone: updatedData.phone || prevProfile.phone,
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

  // Update the parent component's handleEditAll function
  const handleEditAll = useCallback(() => {
    if (!profile) return;
    
    setEditedValues({
      email: profile.email || '',
      phone: profile.phone || '',
      firstName: profile.personalInfo?.firstName || '',
      lastName: profile.personalInfo?.lastName || '',
      address1: profile.personalInfo?.address1 || '',
      address2: profile.personalInfo?.address2 || '',
      city: profile.personalInfo?.city || '',
      state: profile.personalInfo?.state || '',
      pincode: profile.personalInfo?.pincode || '',
      country: profile.personalInfo?.country || '',
    });
    setIsEditing(true);
  }, [profile]);

  const handleSaveAll = async () => {
    await handleEditSubmit('all', editedValues);
    setIsEditing(false);
    setEditedValues({});
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

  const handleInputChange = (field: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [field]: value }));
  };

  // Update the EditableSection component
  const getIcon = (field: string) => {
    switch (field) {
      case 'email':
        return <Mail className="w-5 h-5 text-gray-500" />;
      case 'phone':
        return <Phone className="w-5 h-5 text-gray-500" />;
      case 'firstName':
      case 'lastName':
        return <User className="w-5 h-5 text-gray-500" />;
      case 'address1':
      case 'address2':
        return <Home className="w-5 h-5 text-gray-500" />;
      case 'city':
        return <Building2 className="w-5 h-5 text-gray-500" />;
      case 'state':
      case 'country':
        return <Flag className="w-5 h-5 text-gray-500" />;
      case 'pincode':
        return <MapPin className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const EditableSection = React.memo(({ 
    section, 
    fields, 
    profile,
    isEditing,
    editedValues,
    onInputChange
  }: EditableSectionProps) => {
    // Move all hooks to the top level
    const inputRefs = useRef<{[key: string]: HTMLInputElement}>({});
    const handleInputChange = useCallback((field: string, value: string) => {
      onInputChange(field, value);
    }, [onInputChange]);

    const getValue = useCallback((field: string): string => {
      if (!profile) return '';
      return profile[field as keyof Profile] as string || 
             profile.personalInfo?.[field as keyof PersonalInfo] || '';
    }, [profile]);

    useEffect(() => {
      if (!isEditing) return;

      const handleFocus = (field: string) => {
        localStorage.setItem('lastFocusedField', field);
      };

      fields.forEach(field => {
        const input = inputRefs.current[field];
        if (input) {
          input.addEventListener('focus', () => handleFocus(field));
        }
      });

      const lastFocused = localStorage.getItem('lastFocusedField');
      if (lastFocused && inputRefs.current[lastFocused]) {
        inputRefs.current[lastFocused].focus();
      }

      return () => {
        fields.forEach(field => {
          const input = inputRefs.current[field];
          if (input) {
            input.removeEventListener('focus', () => handleFocus(field));
          }
        });
      };
    }, [isEditing, fields]);

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
        </div>

        <div className="space-y-2">
          {fields.map(field => (
            <div key={field} className="flex items-center text-sm sm:text-base text-gray-700 py-1">
              {getIcon(field)}
              {isEditing ? (
                <input
                  ref={el => {
                    if (el) inputRefs.current[field] = el;
                  }}
                  type="text"
                  value={editedValues[field] ?? getValue(field)}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  onFocus={() => localStorage.setItem('lastFocusedField', field)}
                  className="w-full px-3 py-2 ml-2 text-sm sm:text-base border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#663399] focus:border-transparent
                    transition-shadow"
                />
              ) : (
                field === 'phone' ? (
                  <span className="flex items-center gap-2 ml-2">
                    <a href={`tel:${formatPhoneNumber(getValue(field))}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline">
                      {getValue(field)}
                    </a>
                    <a href={`https://wa.me/${formatPhoneNumber(getValue(field))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 p-1 hover:bg-green-50 rounded-full transition-colors">
                      <BsWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  </span>
                ) : (
                  <span className="ml-2">{getValue(field)}</span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    );
  });

  // Add display name for memo component
  EditableSection.displayName = 'EditableSection';

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
            {/* Add Edit/Save buttons at the top */}
            <div className="flex justify-end">
              {isEditing ? (
                <div className="space-x-2">
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditedValues({});
                    }}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 
                      text-white transition-colors">
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveAll}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700 
                      text-white transition-colors">
                    Save All
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleEditAll}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 hover:bg-blue-600 
                    text-white transition-colors">
                  Edit Profile
                </button>
              )}
            </div>

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
              isEditing={isEditing}
              editedValues={editedValues}
              onInputChange={handleInputChange}
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
              isEditing={isEditing}
              editedValues={editedValues}
              onInputChange={handleInputChange}
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