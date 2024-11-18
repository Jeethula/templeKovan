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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton";


interface Relationship {
  id?: string;
  relation: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// interface FamilyMember {
//   id?: string;
//   name: string;
//   relationship: string;
//   age: string;
// }

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
  const [existingRelationships, setExistingRelationships] = useState<Relationship[]>([]);
  // const [setEligibleUsers] = useState<Array<{
  //   id: string;
  //   phone: string;
  //   email: string;
  //   personalInfo: {
  //     firstName: string;
  //     lastName: string;
  //   } | null;
  // }>>([]);
  const [isLoadingRelationships, setIsLoadingRelationships] = useState(true);

  useEffect(() => {
    // const fetchEligibleUsers = async () => {
    //   try {
    //     const response = await fetch('/api/eligibleUsers', {
    //       method: 'GET',
    //       headers: { 'Content-Type': 'application/json' },
    //     });
    //     const data = await response.json();
    //   } catch (error) {
    //     console.error('Error fetching eligible users:', error);
    //   }
    // };

    const fetchExistingRelationships = async () => {
      setIsLoadingRelationships(true);
      try {
        const userID = user.userid;
        const response = await fetch(`/api/eligibleUsers/relationships?userId=${userID}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.status === 200) {
          setExistingRelationships(data.relationships);
        }
      } catch (error) {
        console.error('Error fetching relationships:', error);
      } finally {
        setIsLoadingRelationships(false);
      }
    };

    // fetchEligibleUsers();
    fetchExistingRelationships();
  }, [user.userid]);

  useEffect(() => {
    setFormData(user);
    // Reset other states when user changes
    setErrors({});
    setExistingRelationships([]);
  }, [user]); // Add user as dependency

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
      // Update the request to match the API route structure
      const response = await fetch('/api/profile', {  // Remove the user ID from URL
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: user.userid,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      const data = await response.json();
      toast.success(data.message || "User updated successfully");
      if (refreshData) {
        refreshData();
      }
      onClose();
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
          setFormData(user); // Reset to current user data
          setErrors({}); 
          setExistingRelationships([]); // Reset relationships
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
              ) : existingRelationships.length > 0 ? (
                <div className="space-y-3">
                  {existingRelationships.map((relation, index) => (
                    <div key={index} className="flex gap-3 items-center border p-3 rounded-lg">
                      <div className="w-1/3">
                        <div className="text-sm text-gray-600 capitalize">{relation.relation}</div>
                      </div>
                      <div className="w-2/3">
                        <div className="text-sm font-medium">
                          {`${relation.firstName} ${relation.lastName}`}
                        </div>
                        <div className="text-xs text-gray-500">{relation.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4 border rounded-lg">
                  No family relationships found.
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
}>(({ value, onValueChange, disabled, options }, ref) => {
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
              ) : 'Select person...'}
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
