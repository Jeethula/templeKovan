"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { PersonalInfo } from "./types";
import { toast } from "react-hot-toast";
import {
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FloatingLabelInput, FloatingSelect } from "@/components/ui/floating";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "cmdk";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton";


interface Relationship {
  id: string;
  relation: 'son' | 'daughter' | 'father';
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface UserEditModalProps {
  user: PersonalInfo;
  isOpen: boolean;
  onClose: () => void;
  refreshData?: () => void;  // Add this new prop
}

export function UserEditModal({ 
  user, 
  isOpen, 
  onClose,
  refreshData 
}: UserEditModalProps) {
  const [formData, setFormData] = useState<PersonalInfo>(user);
  const [errors, setErrors] = useState<Partial<PersonalInfo>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable] = useState(true);
  const [eligibleUsers, setEligibleUsers] = useState<Array<{
    id: string;
    phone: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    } | null;
  }>>([]);
  const [selectedChildren, setSelectedChildren] = useState<Array<{id: string, relation: 'son' | 'daughter', firstName?: string, lastName?: string}>>([]);
  const [fatherDetails, setFatherDetails] = useState<Relationship | null>(null);
  const [isLoadingRelationships, setIsLoadingRelationships] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      
      setIsLoadingRelationships(true);
      try {
        // First fetch eligible users
        const eligibleResponse = await fetch('/api/eligibleUsers');
        const eligibleData = await eligibleResponse.json();
        if (eligibleData.status === 200) {
          setEligibleUsers(eligibleData.users);
        }

        // Then fetch user details with relationships
        const userResponse = await fetch(`/api/userDetails?userId=${user.userid}`);
        const data = await userResponse.json();
        console.log('API Response:', data); // Debug log

        if (data.status === 200) {
          // Handle father relationship
          if (data.father) {
            setFatherDetails({
              id: data.father.id,
              relation: 'father',
              firstName: data.father.firstName,
              lastName: data.father.lastName,
              phone: data.father.phone
            });
          }

          // Handle children relationships
          if (data.relationships) {
            const childrenRelations = data.relationships
              .filter((rel: Relationship) => rel.relation === 'son' || rel.relation === 'daughter')
              .map((child: Relationship) => ({
                id: child.id,
                relation: child.relation as 'son' | 'daughter',
                firstName: child.firstName,
                lastName: child.lastName
              }));
            console.log('Setting children:', childrenRelations); // Debug log
            setSelectedChildren(childrenRelations);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingRelationships(false);
      }
    };

    fetchData();
  }, [user.userid, isOpen]);

  useEffect(() => {
    setFormData(user);
    setErrors({});
  }, [user]); // Only depend on user changes

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Partial<PersonalInfo> = {};
    let isValid = true;

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (formData.Phone && !/^\d{10}$/.test(formData.Phone)) {
      newErrors.Phone = "Phone number must be 10 digits";
      isValid = false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/userDetails', {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.userid,
          userDetails: {
            salutation: formData.salutation,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address1: formData.address1,
            address2: formData.address2,
            city: formData.city,
            pincode: formData.pincode,
            state: formData.state,
            country: formData.country,
          },
          relationships: [
            ...(fatherDetails ? [{
              id: fatherDetails.id,
              relation: 'father',
              firstName: fatherDetails.firstName,
              lastName: fatherDetails.lastName
            }] : []),
            ...selectedChildren.filter(child => child.id) // Only include children with valid IDs
          ]
        }),
      });

      const data = await response.json();
      
      if (data.status === 200) {
        toast.success("User updated successfully");
        if (refreshData) {
          refreshData();
        }
        onClose();
      } else {
        throw new Error(data.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold text-[#663399]">
            Edit User Details
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Unique ID Section */}
          {formData.unique_id && (
            <div className="relative group flex items-center gap-6">
              <p className="text-sm text-gray-400">
                Your Unique ID : <span className="text-gray-400 font-medium">{formData.unique_id}</span>
              </p>
              <div className="relative inline-block cursor-help">
                <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div className="invisible group-hover:visible absolute left-0 top-6 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                  To modify your unique ID, please contact admin
                </div>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="flex gap-3">
                <div className="w-1/3">
                  <FloatingSelect
                    id="salutation"
                    label="Salutation"
                    value={formData.salutation}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, salutation: value }))}
                    disabled={!isEditable}
                  >
                    <SelectContent>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                      <SelectItem value="Mrs.">Mrs.</SelectItem>
                    </SelectContent>
                  </FloatingSelect>
                </div>
                <div className="w-2/3">
                  <FloatingLabelInput
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                  />
                </div>
              </div>
            </div>

            {/* Last Name */}
            <div className="col-span-2">
              <FloatingLabelInput
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
              />
            </div>

            {/* Contact Information */}
            <div className="col-span-2">
              <FloatingLabelInput
                id="phone"
                name="Phone"
                label="Phone Number"
                value={formData.Phone}
                onChange={handleInputChange}
                error={errors.Phone}
                maxLength={10}
              />
            </div>

            {/* Address Details */}
            <div className="col-span-2">
              <div className="text-sm font-medium text-[#663399]/80 pb-1 mb-4">Address Details</div>
              <div className="space-y-4">
                <FloatingLabelInput
                  id="address"
                  name="address"
                  label="Address Line 1"
                  value={formData.address1}
                  onChange={handleInputChange}
                />
                <FloatingLabelInput
                  id="address2"
                  name="address2"
                  label="Address Line 2"
                  value={formData.address2}
                  onChange={handleInputChange}
                />
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <FloatingLabelInput
                      id="city"
                      name="city"
                      label="City"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-1/2">
                    <FloatingLabelInput
                      id="state"
                      name="state"
                      label="State"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <FloatingLabelInput
                      id="pincode"
                      name="pincode"
                      label="Pin Code"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      maxLength={6}
                    />
                  </div>
                  <div className="w-1/2">
                    <FloatingLabelInput
                      id="country"
                      name="country"
                      label="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Family Relationships Section */}
            <div className="col-span-2 space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-[#663399]/80 pb-1">Family Relationships</div>
              </div>

              {isLoadingRelationships ? (
                <div className="space-y-3">
                  {[1, 2].map((index) => (
                    <div key={index} className="flex gap-3 items-center border p-3 rounded-lg">
                      <Skeleton className="h-9 w-1/3" />
                      <Skeleton className="h-9 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="text-sm font-medium text-[#663399]/80 pb-1">Family Relationships</div>

                  {/* Father Selection */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 border p-3 rounded-lg">
                      <div className="flex-[0.3] min-w-[120px]">
                        <FloatingSelect
                          id="fatherRelation"
                          value="father"
                          onValueChange={() => {}}
                          label="Relation Type"
                          disabled={true}
                        >
                          <SelectContent>
                            <SelectItem value="father">Father</SelectItem>
                          </SelectContent>
                        </FloatingSelect>
                      </div>
                      
                      <div className="flex-1 min-w-[200px]">
                        <FloatingSearchCombobox
                          value={fatherDetails?.id || ''}
                          onValueChange={(value) => {
                            if (!value) {
                              setFatherDetails(null);
                            } else {
                              const selectedUser = eligibleUsers.find(u => u.id === value);
                              setFatherDetails({
                                id: value,
                                relation: 'father',
                                firstName: selectedUser?.personalInfo?.firstName,
                                lastName: selectedUser?.personalInfo?.lastName,
                                phone: selectedUser?.phone
                              });
                            }
                          }}
                          label="Select Father"
                          options={eligibleUsers}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Children Section */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setSelectedChildren([...selectedChildren, { id: '', relation: 'son' }])}
                      className="w-fit text-sm px-3 py-1.5 bg-[#663399] text-white rounded-lg hover:bg-[#663399]/90"
                    >
                      Add Child
                    </button>

                    {selectedChildren.length > 0 ? (
                      selectedChildren.map((child, index) => (
                        <div key={index} className="flex flex-wrap items-center gap-3 border p-3 rounded-lg">
                          <div className="flex-[0.3] min-w-[120px]">
                            <FloatingSelect
                              id={`childRelation-${index}`}
                              value={child.relation}
                              onValueChange={(value) => {
                                const updatedChildren = [...selectedChildren];
                                updatedChildren[index].relation = value as 'son' | 'daughter';
                                setSelectedChildren(updatedChildren);
                              }}
                              label="Relation Type"
                            >
                              <SelectContent>
                                <SelectItem value="son">Son</SelectItem>
                                <SelectItem value="daughter">Daughter</SelectItem>
                              </SelectContent>
                            </FloatingSelect>
                          </div>

                          <div className="flex-1 min-w-[200px]">
                            <FloatingSearchCombobox
                              value={child.id}
                              onValueChange={(value) => {
                                const selectedUser = eligibleUsers.find(u => u.id === value);
                                const updatedChildren = [...selectedChildren];
                                updatedChildren[index] = {
                                  ...updatedChildren[index],
                                  id: value,
                                  firstName: selectedUser?.personalInfo?.firstName,
                                  lastName: selectedUser?.personalInfo?.lastName
                                };
                                setSelectedChildren(updatedChildren);
                              }}
                              label="Select Child"
                              options={eligibleUsers}
                              initialDisplay={child.firstName && child.lastName ? `${child.firstName} ${child.lastName}` : undefined}
                            />
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setSelectedChildren(selectedChildren.filter((_, i) => i !== index));
                            }}
                            className="p-2"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <p className="text-gray-500 text-center text-sm">No children mapped yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#663399] hover:bg-[#663399]/90" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to get display name from options
const getDisplayName = (id: string, options: Array<{
  id: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
  } | null;
}>) => {
  const option = options.find(opt => opt.id === id);
  if (!option?.personalInfo) return 'Unknown';
  return `${option.personalInfo.firstName || ''} ${option.personalInfo.lastName || ''}`.trim();
};

// Update FloatingSearchCombobox component
const FloatingSearchCombobox = React.forwardRef<HTMLDivElement, {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  options: Array<{
    id: string;
    phone: string;
    personalInfo?: {
      firstName?: string;
      lastName?: string;
    } | null;
  }>;
  initialDisplay?: string;
}>(({ value, onValueChange, disabled, options, initialDisplay }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    
    return options.filter(option => {
      const firstName = (option.personalInfo?.firstName || '').toLowerCase();
      const lastName = (option.personalInfo?.lastName || '').toLowerCase();
      const phone = (option.phone || '').toLowerCase();
      return `${firstName} ${lastName}`.includes(query) || phone.includes(query);
    });
  }, [options, searchQuery]);

  // Focus input when popover opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (

    <div className="relative w-full" ref={ref}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full h-9 justify-between border rounded-lg text-left text-sm"
            onClick={() => setOpen(true)}
          >
            <span className="truncate">
              {value ? (
                options.find(opt => opt.id === value)?.personalInfo ?
                `${options.find(opt => opt.id === value)?.personalInfo?.firstName || ''} ${options.find(opt => opt.id === value)?.personalInfo?.lastName || ''}`.trim() :
                'Select person...'
              ) : initialDisplay || 'Select person...'}
            </span>
            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0 z-50" 
          align="start"
          sideOffset={5}
          style={{ position: 'relative' }}
        >
          <Command shouldFilter={false}>
            <CommandInput 
              ref={inputRef}
              placeholder="Search..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9 p-3 border-[#dadada] border-2 w-full rounded-b-md  focus:outline-none"
            />
            <CommandList 
              className="max-h-[200px] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300"
            >
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      onValueChange(option.id);
                      setOpen(false);
                    }}
                    className="flex items-center py-2 px-2 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {getDisplayName(option.id, filteredOptions)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {option.phone}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
});

FloatingSearchCombobox.displayName = "FloatingSearchCombobox";
