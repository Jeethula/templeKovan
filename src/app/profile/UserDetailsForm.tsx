"use client";
import React, { useEffect, useState } from "react";
import { UserDetails } from "../../utils/type";
import { initialUserDetails } from "../../utils/type";
// import { useAuth } from "../context/AuthContext";
import { FaUserEdit } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
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
  React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; onValueChange: (value: string) => void }
>(({ id, label, children, value, defaultValue, onValueChange }) => {
  return (
    <div className="relative">
      <Select value={value?.toString()} onValueChange={onValueChange} defaultValue={defaultValue?.toString()}>
        <SelectTrigger className="w-full text-black peer">
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

interface UserDetailsFormProps {
  onProfileCompletion?: () => void;
}

// Add this helper function for generating random IDs
const generateRandomId = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ onProfileCompletion }) => {
  const [userDetails, setUserDetails] =
    useState<UserDetails>(initialUserDetails);
  const [errors, setErrors] = useState<Partial<UserDetails>>({});
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  // const { user } = useAuth();
  const router = useRouter();
  const validateUniqueId = (uniqueId: string): boolean => {
    const regex = /^\d{4,5}$/;
    return regex.test(uniqueId);
  };

  const [isUniqueIdVerified, setIsUniqueIdVerified] = useState<boolean>(false);
  const [uniqueIdCheckMessage, setUniqueIdCheckMessage] = useState<string>("");

  const handleUniqueIdCheck = async () => {
    if (!validateUniqueId(userDetails.unique_id)) {
      setUniqueIdCheckMessage("Invalid Unique ID format");
      setIsUniqueIdVerified(false);
      return;
    }

    try {
      const res = await fetch("/api/checkuniqueid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uniqueId: userDetails.unique_id }),
      });

      const data = await res.json();
      if (data.exists) {
        setUniqueIdCheckMessage("Unique ID already exists");
        setIsUniqueIdVerified(false);
      } else {
        setUniqueIdCheckMessage("Unique ID is available");
        setIsUniqueIdVerified(true);
      }
    } catch (error) {
      console.error("Network error:", error);
      setUniqueIdCheckMessage("Network error. Please try again.");
      setIsUniqueIdVerified(false);
    }
  };

  const getData = async () => {
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
        setIsEditable(false);
        setIsSubmitted(true);
      } else {
        setIsEditable(true);
        toast.success("Please fill the profile info to start");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details. Please try again.");
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
          setEmail(user.email);
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

  // Add this function to automatically generate and verify unique ID
  const generateUniqueId = async () => {
    let isUnique = false;
    let newId: string;
    
    while (!isUnique) {
      newId = generateRandomId();
      try {
        const res = await fetch("/api/checkuniqueid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uniqueId: newId }),
        });
        const data = await res.json();
        if (!data.exists) {
          isUnique = true;
          setUserDetails(prev => ({ ...prev, unique_id: newId }));
          setIsUniqueIdVerified(true);
        }
      } catch (error) {
        console.error("Error checking unique ID:", error);
      }
    }
  };

  useEffect(() => {
    if (isEditable && !isSubmitted) {
      generateUniqueId();
    }
  }, [isEditable, isSubmitted]);

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

  const handleUpdate = async () => {
    if (validateForm()) {
      const userID = JSON.parse(sessionStorage.getItem("user") || "{}").id;
      setLoading(true);
      try {
        const userDetailsToSend = {
          firstName: userDetails.first_name,
          lastName: userDetails.last_name,
          address1: userDetails.address_line_1,
          address2: userDetails.address_line_2,
          city: userDetails.city,
          state: userDetails.state,
          pincode: userDetails.pincode,
          country: userDetails.country,
          comments: userDetails.comments || "",
          salutation: userDetails.salutation,
          avatarUrl: "",
          uniqueId: parseInt(userDetails?.unique_id),
          userId: userID,
          email:  "",
          phone: userDetails.phone_number,
        };

        const res = await fetch("/api/userDetails", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetailsToSend),
        });
        if (res.status === 200) {
          toast.success("Details updated successfully!");
          if (onProfileCompletion) {
            onProfileCompletion?.();
          }

          // await fetch('/api/googlesheets/updaterow', {
          //     method: 'POST',
          //     headers: {
          //         'Content-Type': 'application/json',
          //     },
          //     body: JSON.stringify(userDetailsToSend),
          // });
        } else {
            const resBody = await res.json();
            if(resBody.error === "Phone number already exists"){
                toast.error("Phone number already exists");
                return;
            }
          toast.error("Failed to update details.");
        }
      } catch (error) {
        toast.error("Error: " + error);
      } finally {
        setLoading(false);
        setIsEditable(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEditable) {
      toast.error('Please click the "Edit" button to edit your details.');
      return;
    }
    if (!isUniqueIdVerified) {
      toast.error("Please verify the Unique ID");
      return;
    }
    if (validateForm()) {
      const userID = JSON.parse(sessionStorage.getItem("user") || "{}").id;
      setLoading(true);
      try {
        const userDetailsToSend = {
          uniqueId: parseInt(userDetails?.unique_id),
          firstName: userDetails.first_name,
          lastName: userDetails.last_name,
          phone: userDetails.phone_number,
          address1: userDetails.address_line_1,
          address2: userDetails.address_line_2,
          city: userDetails.city,
          state: userDetails.state,
          pincode: userDetails.pincode,
          country: userDetails.country,
          comments: userDetails.comments || "",
          email: email,
          avatarUrl:  "",
          salutation: userDetails.salutation,
          userId: userID,
        };

        const res = await fetch("/api/userDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetailsToSend),
        });
        if (res.status === 200) {
          setIsEditable(false);
          toast.success("Details submitted successfully!");

          await fetch("/api/googlesheets/addrow", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userDetailsToSend),
          });

          if (onProfileCompletion) {
            onProfileCompletion?.();
          }
        } else {
          toast.error("Failed to submit details.");
        }
      } catch (error) {
        console.log(error, "error");
        toast.error("Error: " + error);
      } finally {
        setLoading(false);
      }
    }
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
            <p className="text-sm text-gray-600">Complete your profile information</p>
          </div>

          {/* Edit Button */}
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

            {/* Comments Section */}
            <div className="pt-2">
              {renderField("comments", "Additional Comments", userDetails, handleChange, isEditable, errors, "textarea")}
            </div>

            {/* Submit/Update Button */}
            {isEditable && (
              <button
                type={isSubmitted ? "button" : "submit"}
                onClick={isSubmitted ? handleUpdate : undefined}
                disabled={loading}
                className="w-full h-11 text-base font-medium 
                         bg-[#663399] hover:bg-[#663399]/90 text-white rounded-lg
                         transition-all duration-200 mt-6
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">{isSubmitted ? "Updating..." : "Submitting..."}</span>
                  </div>
                ) : (
                  <span>{isSubmitted ? "Update Profile" : "Complete Profile"}</span>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

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