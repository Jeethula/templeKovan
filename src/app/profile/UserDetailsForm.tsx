"use client";
import React, { useEffect, useState } from "react";
import { UserDetails,initialUserDetails } from "../../utils/type";
// import { useAuth } from "../context/AuthContext";
import { FaUserEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check, Trash2 } from "lucide-react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

const FloatingInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return <Input placeholder=" " className={cn('peer', className)} ref={ref} {...props} />;
  },
);
FloatingInput.displayName = 'FloatingInput';

const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      className={cn(
        'peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-2 z-0 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = 'FloatingLabel';

type FloatingLabelInputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingInput ref={ref} id={id} {...props} />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
    </div>
  );
});
FloatingLabelInput.displayName = 'FloatingLabelInput';

const FloatingSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; onValueChange: (value: string) => void; disabled?: boolean }
>(({ id, label, children, value, defaultValue, onValueChange, disabled }) => {
  return (
    <div className="relative">
      <Select value={value?.toString()} onValueChange={onValueChange} defaultValue={defaultValue?.toString()} disabled={disabled}>
        <SelectTrigger className={`w-full text-black peer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <SelectValue placeholder=" " />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {children}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
    </div>
  );
});
FloatingSelect.displayName = 'FloatingSelect';

const FloatingTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }
>(({ id, label, ...props }, ref) => {
  return (
    <div className="relative">
      <Textarea placeholder=" " className="peer" ref={ref} {...props} />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
    </div>
  );
});
FloatingTextarea.displayName = 'FloatingTextarea';

const FormFieldSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-10 w-full" />
  </div>
);

interface UserDetailsFormProps {
  onProfileCompletion?: () => void;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ }) => {
  const [userDetails, setUserDetails] =
    useState<UserDetails>(initialUserDetails);
  const [errors, setErrors] = useState<Partial<UserDetails>>({});
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  // const [ setIsSubmitted] = useState<boolean>(false);
  // const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  // const [father, setFather] = useState<string>("");
  // const [mother, setMother] = useState<string>("");
  // const { user } = useAuth();
  const router = useRouter();

  const [eligibleUsers, setEligibleUsers] = useState<Array<{
    id: string;
    phone: string;
    email: string;
    personalInfo: {
      firstName: string;
      lastName: string;
      uniqueId: number;
    } | null;
  }>>([]);
  // const [selectedChild, setSelectedChild] = useState("");
  // const [relationshipType, setRelationshipType] = useState<"son" | "daughter">("son");

  interface ChildRelation {
    id: string;
    relation: 'son' | 'daughter';
  }

  const [selectedChildren, setSelectedChildren] = useState<ChildRelation[]>([]);

  interface Relationship {
    id: string;
    relation: 'son' | 'daughter';
    firstName?: string;
    lastName?: string;
    phone?: string;
  }

  const [existingRelationships, setExistingRelationships] = useState<Relationship[]>([]);

  const getData = async () => {
    setIsLoading(true);
    const userID = JSON.parse(sessionStorage.getItem("user") || "{}").id;
    try {
      const data = await fetch(`/api/userDetails?userId=${userID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await data.json();
      if (res.userDetails) {
        setUserDetails({
          salutation: res.userDetails.salutation,
          first_name: res.userDetails.firstName,
          last_name: res.userDetails.lastName,
          phone_number: res?.user?.phone,
          address_line_1: res.userDetails.address1,
          address_line_2: res.userDetails.address2,
          city: res.userDetails.city,
          state: res.userDetails.state,
          country: res.userDetails.country,
          pincode: res.userDetails.pincode,
          comments: res.userDetails.comments,
          unique_id: res.userDetails.uniqueId,
        });
        
        // Properly set father and mother names with null checks
        // if (res.father && res.father.firstName && res.father.lastName) {
        //   setFather(`${res.father.firstName} ${res.father.lastName}`.trim());
        // }
        
        // if (res.mother && res.mother.firstName && res.mother.lastName) {
        //   setMother(`${res.mother.firstName} ${res.mother.lastName}`.trim());
        // }

        setIsEditable(false);
        // setIsSubmitted(true);
      } else {
        setIsEditable(true);
        toast.success("Please fill the profile info to start");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // const UserDetails = async () => {
  //   const data = await fetch('/api/auth',{
  //     method:'POST',
  //     headers:{
  //       'Content-Type':'application/json'
  //     },
  //     body:JSON.stringify({
  //       email:user?.email
  //   })
  //   })
  //   const res = await data.json();
  //   console.log(res,"from page");
  //   sessionStorage.setItem('user',JSON.stringify(res.user));
  // }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // await UserDetails();
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        if (user) {
     //     setEmail(user.email);
          await getData();
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        router.push("/");
      }
    };
    fetchUserDetails();
  }, [router]);

  useEffect(() => {
    const fetchEligibleUsers = async () => {
      try {
        const response = await fetch('/api/eligibleUsers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('Received users:', data); // Debug log
        if (data.status === 200) {
          setEligibleUsers(data.users);
        }
      } catch (error) {
        console.error('Error fetching eligible users:', error);
      }
    };

    fetchEligibleUsers();
  }, []);

  useEffect(() => {
    const fetchExistingRelationships = async () => {
      try {
        const userID = JSON.parse(sessionStorage.getItem("user") || "{}").id;
        const response = await fetch(`/api/eligibleUsers/relationships?userId=${userID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.status === 200) {
          setExistingRelationships(data.relationships);
          // Initialize selectedChildren with existing relationships
          setSelectedChildren(data.relationships.map((rel:Relationship) => ({
            id: rel.id,
            relation: rel.relation
          })));
        }
      } catch (error) {
        console.error('Error fetching relationships:', error);
      }
    };

    fetchExistingRelationships();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "phone_number" && isNaN(Number(value))) return;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetails> = {};
    let isValid = true;

    Object.entries(userDetails).forEach(([key, value]) => {
      if (key !== 'comments' && value === "") {
        newErrors[key as keyof UserDetails] = `${key.replace(
          "_",
          " "
        )} is required`;
        isValid = false;
      }
    });

    if (userDetails.pincode.length !== 6) {
      newErrors.pincode = "Pincode should be 6 digits";
      isValid = false;
    }

    if (userDetails.phone_number.length !== 10) {
      newErrors.phone_number = "Phone number should be 10 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // const handleUpdate = async () => {
  //   if (validateForm()) {
  //     const userID = JSON.parse(sessionStorage.getItem("user") || "{}").id;
  //     setLoading(true);
  //     try {
  //       const userDetailsToSend = {
  //         firstName: userDetails.first_name,
  //         lastName: userDetails.last_name,
  //         address1: userDetails.address_line_1,
  //         address2: userDetails.address_line_2,
  //         city: userDetails.city,
  //         state: userDetails.state,
  //         pincode: userDetails.pincode,
  //         country: userDetails.country,
  //         comments: userDetails.comments || "",
  //         salutation: userDetails.salutation,
  //         uniqueId: parseInt(userDetails?.unique_id),
  //         userId: userID,
  //         email: email || ""  ,
  //         phone: userDetails.phone_number,
  //         isfirstTimeLogin:false,
  //       };

  //       const res = await fetch("/api/userDetails", {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(userDetailsToSend),
  //       });

  //       const resBody = await res.json();
  //           if(resBody.error === "Phone number already exists"){
  //               toast.error("Phone number already exists");
  //               toast.error("Failed to update details.");
  //               return;
  //           }

  //       if (res.status === 200) {
  //         toast.success("Details updated successfully!");
  //         if (onProfileCompletion) {
  //           onProfileCompletion?.();
  //         }
  //         // Refresh the page after successful update
  //         window.location.reload();
  //         // Or use router.refresh() for Next.js soft refresh:
  //         // router.refresh();
  //       } 
            
        
  //     } catch (error) {
  //       toast.error("Error: " + error);
  //     } finally {
  //       setLoading(false);
  //       setIsEditable(false);
  //     }
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEditable) return;
    
    if (validateForm()) {
      setLoading(true);
      try {
        const userID = JSON.parse(sessionStorage.getItem("user") || "{}").id;
        const response = await fetch("/api/userDetails", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userID,
            userDetails: {
              salutation: userDetails.salutation,
              firstName: userDetails.first_name,
              lastName: userDetails.last_name,
              address1: userDetails.address_line_1,
              address2: userDetails.address_line_2,
              city: userDetails.city,
              pincode: userDetails.pincode,
              state: userDetails.state,
              country: userDetails.country,
            },
            relationships: selectedChildren || []
          }),
        });

        const data = await response.json();
        
        if (data.status === 200) {
          toast.success("Profile updated successfully");
          setIsEditable(false);
          // Refresh data and page
          await getData();
          window.location.reload(); // This will reload the entire page
          // Alternatively, you can use router.refresh() for Next.js soft refresh:
          // router.refresh();
        } else {
          toast.error(data.error || "Failed to update profile");
          console.error('Update error details:', data.details);
        }
      } catch (error) {
        toast.error("An error occurred while updating profile");
        console.error('Submit error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addChildRelation = () => {
    setSelectedChildren([...selectedChildren, { id: '', relation: 'son' }]);
  };

  return (
    <div className="min-h-screen bg-[#fdf0f4]">
      <div className="w-full max-w-lg mx-auto p-4">
        <div className="bg-white rounded-xl shadow-md border border-[#663399]/20 p-4">
          {/* Header Section */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-bold text-[#663399]">
              Profile Details
            </h1>
            <p className="text-sm text-gray-600"> Your complete profile information</p>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <FormFieldSkeleton />
              <div className="flex gap-3">
                <div className="w-1/3">
                  <FormFieldSkeleton />
                </div>
                <div className="w-2/3">
                  <FormFieldSkeleton />
                </div>
              </div>
              <FormFieldSkeleton />
              <FormFieldSkeleton />
              <FormFieldSkeleton />
              <FormFieldSkeleton />
              <div className="flex gap-3">
                <div className="w-1/2">
                  <FormFieldSkeleton />
                </div>
                <div className="w-1/2">
                  <FormFieldSkeleton />
                </div>
              </div>
              <Skeleton className="h-11 w-full mt-6" />
            </div>
          ) : (
            <>
              {/* Existing form content */}
              {Object.keys(userDetails).some(
                (key) => userDetails[key as keyof UserDetails]
              ) && (
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={() => setIsEditable(!isEditable)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium 
                             bg-[#663399] hover:bg-[#663399]/90 text-white rounded-lg
                             transition-all duration-200"
                  >
                    {!isEditable ? "Edit Profile" : "Cancel"} <FaUserEdit />
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Section - Salutation and First Name in same row */}
             { userDetails.unique_id && 
  <div className="relative group flex items-center  gap-6">
    <p className="text-sm text-gray-400">
      Your Unique ID : <span className="text-gray-400 font-medium">{userDetails.unique_id}</span>
    </p>
    <div className="relative inline-block cursor-help">
      <svg 
        className="w-4 h-4 text-gray-400 hover:text-gray-600" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="invisible group-hover:visible absolute left-0 top-6 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
        To modify your unique ID, please contact admin
      </div>
    </div>
  </div>
}
                <div className="flex gap-3">
                  <div className="w-1/3">
                    {renderField("salutation", "Salutation", userDetails, handleChange, isEditable, errors, "select", [
                      "Mr.", "Ms.", "Mrs.", "Dr.", "Prof.", "Mx.",
                    ])}
                  </div>
                  <div className="w-2/3">
                    {renderField("first_name", "First Name", userDetails, handleChange, isEditable, errors)}
                  </div>
                </div>

                {/* Other Personal Details */}
                <div className="space-y-4">
                  {renderField("last_name", "Last Name", userDetails, handleChange, isEditable, errors)}
                  {renderField("phone_number", "Phone Number", userDetails, handleChange, isEditable, errors)}
                </div>

                {/* Address Section */}
                <div className="space-y-4 pt-2">
                  <div className="text-sm font-medium text-[#663399]/80 pb-1">Address Details</div>
                  {renderField("address_line_1", "Address Line 1", userDetails, handleChange, isEditable, errors)}
                  {renderField("address_line_2", "Address Line 2", userDetails, handleChange, isEditable, errors)}

                  {/* City and State in same row */}
                  <div className="flex gap-3">
                    <div className="w-1/2">
                      {renderField("city", "City", userDetails, handleChange, isEditable, errors)}
                    </div>
                    <div className="w-1/2">
                      {renderField("state", "State", userDetails, handleChange, isEditable, errors)}
                    </div>
                  </div>

                  {/* Pincode and Country in same row */}
                  <div className="flex gap-3">
                    <div className="w-1/2">
                      {renderField("pincode", "Pin Code", userDetails, handleChange, isEditable, errors)}
                    </div>
                    <div className="w-1/2">
                      {renderField("country", "Country", userDetails, handleChange, isEditable, errors)}
                    </div>
                  </div>
                </div>

                {/* assign son or daughter to the user  */}
                {/* Family Relationship Section */}
                <div className="space-y-4 pt-2">
                  <div className="text-sm font-medium text-[#663399]/80 pb-1">Family Relationships</div>
                  
                  {/* Add Member Button and New Fields */}
                  <div className="space-y-3">
                    {isEditable && (
                      <button
                        type="button"
                        onClick={addChildRelation}
                        className="w-full text-sm px-3 py-1.5 bg-[#663399] text-white rounded-lg hover:bg-[#663399]/90"
                      >
                        Add member
                      </button>
                    )}

                    {/* New relationship fields appear here */}
                    {isEditable && selectedChildren.map((child, index) => (
                      <div key={index} className="flex flex-wrap items-center gap-3 border p-3 rounded-lg bg-white">
                        {/* Relation Type Select */}
                        <div className="flex-[0.3] min-w-[120px]">
                          <FloatingSelect
                            id={`relationshipType-${index}`}
                            value={child.relation}
                            onValueChange={(value) => {
                              const newChildren = [...selectedChildren];
                              newChildren[index].relation = value as 'son' | 'daughter';
                              setSelectedChildren(newChildren);
                            }}
                            label="Relation Type"
                            disabled={false}
                          >
                            <SelectContent>
                              <SelectItem value="son">Son</SelectItem>
                              <SelectItem value="daughter">Daughter</SelectItem>
                            </SelectContent>
                          </FloatingSelect>
                        </div>
                        
                        {/* Person Select */}
                        <div className="flex-1 min-w-[200px]">
                          <FloatingSearchCombobox
                            value={child.id}
                            onValueChange={(value) => {
                              const newChildren = [...selectedChildren];
                              newChildren[index].id = value;
                              setSelectedChildren(newChildren);
                            }}
                            label="Select Person"
                            disabled={false}
                            options={eligibleUsers}
                          />
                        </div>

                        {/* Delete Icon */}
                        <button
                          type="button"
                          onClick={() => {
                            const newChildren = selectedChildren.filter((_, i) => i !== index);
                            setSelectedChildren(newChildren);
                          }}
                          className="flex-none p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                          title="Remove relationship"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Existing Relationships */}
                  {!isLoading && existingRelationships.length > 0 && (
                    <div className="space-y-3 mt-6 border-t pt-4">
                      <div className="text-sm font-medium text-gray-500">Existing Relationships</div>
                      {existingRelationships.map((relation, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium text-[#663399] capitalize">{relation.relation}: </span>
                              <span className="text-gray-700">
                                {relation.firstName} {relation.lastName}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">{relation.phone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit/Update Button */}
                {isEditable && (
                  <button
                    type="submit"
                    className="w-full mt-6 h-11 text-base font-medium 
                              bg-[#663399] hover:bg-[#663399]/90 text-white rounded-lg
                              transition-all duration-200"
                  >
                    {loading ? 'Updating Profile...' : 'Update Profile'}
                  </button>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// First, create the FloatingSearchCombobox component
const FloatingSearchCombobox = React.forwardRef<
  HTMLDivElement,
  {
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
  }
>(({ value, onValueChange, label, disabled, options }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = React.useMemo(() => {
    return options.filter((option) => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      const firstName = option.personalInfo?.firstName?.toLowerCase() || '';
      const lastName = option.personalInfo?.lastName?.toLowerCase() || '';
      const phone = option.phone.toLowerCase();
      const fullName = `${firstName} ${lastName}`.trim();
      
      // Check if any part contains the search query
      return fullName.includes(query) || 
             firstName.includes(query) || 
             lastName.includes(query) || 
             phone.includes(query);
    });
  }, [options, searchQuery]);

  return (
    <div className="relative" ref={ref}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={`w-full justify-between border rounded-lg text-left font-normal peer overflow-hidden
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="truncate flex-1 mr-2">
              {value ? (
                options.find((option) => option.id === value) ? (
                  `${options.find((option) => option.id === value)?.personalInfo?.firstName || ''} ${
                    options.find((option) => option.id === value)?.personalInfo?.lastName || ''
                  }`.trim() || 'Unnamed'
                ) : (
                  'Select person...'
                )
              ) : (
                'Select person...'
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 flex-none" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search by name or phone..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />
            <CommandList className="max-h-[200px] overflow-auto">
              <CommandEmpty>No person found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Check
                        className={cn(
                          "h-4 w-4 flex-none",
                          value === option.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate">
                          {`${option.personalInfo?.firstName || ''} ${option.personalInfo?.lastName || ''}`.trim() || 'Unnamed'}
                        </span>
                        <span className="text-sm text-gray-500 truncate">{option.phone}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FloatingLabel htmlFor={label}>{label}</FloatingLabel>
    </div>
  );
});
FloatingSearchCombobox.displayName = 'FloatingSearchCombobox';

// Update the renderField function styling
const renderField = (
  name: keyof UserDetails,
  label: string,
  userDetails: UserDetails,
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void,
  isEditable: boolean,
  errors: Partial<UserDetails>,
  type: string = "text",
  options?: string[]
) => (
  <div className="relative">
    {type === "select" ? (
      <FloatingSelect
        id={name}
        value={userDetails[name]}
        onValueChange={(value) => handleChange({
          target: { name, value },
        } as React.ChangeEvent<HTMLInputElement>)}
        disabled={!isEditable}
        label={label}
        className="w-full border border-[#663399]/20 rounded-lg text-sm"
      >
        {options?.map((option) => (
          <SelectItem key={option} value={option} className="text-sm">{option}</SelectItem>
        ))}
      </FloatingSelect>
    ) : type === "textarea" ? (
      <FloatingTextarea
        id={name}
        name={name}
        value={userDetails[name]}
        onChange={handleChange}
        disabled={!isEditable}
        label={label}
        className="w-full min-h-[80px] border border-[#663399]/20 rounded-lg text-sm"
      />
    ) : (
      <FloatingLabelInput
        type={type}
        id={name}
        name={name}
        label={label}
        value={userDetails[name]}
        onChange={handleChange}
        disabled={!isEditable}
        maxLength={name === "phone_number" ? 10 : name === "pincode" ? 6 : undefined}
        className="w-full border border-[#663399]/20 rounded-lg text-sm"
      />
    )}
    {errors[name] && (
      <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
    )}
  </div>
);

export default UserDetailsForm;