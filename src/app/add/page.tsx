"use client";
import React, { useState, useEffect } from "react";
import { UserDetails, initialUserDetails } from "../../utils/type";
// import { useAuth } from "../context/AuthContext";
import { MdGroupAdd } from "react-icons/md";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import withProfileCheck from "@/components/withProfileCheck";
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
  React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; onChange: (value: string) => void }
>(({ id, label, children, value, defaultValue, onChange }) => {
  return (
    <div className="relative">
      <Select value={value?.toString()} onValueChange={onChange} defaultValue={defaultValue?.toString()}>
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

// Add helper function for generating random IDs (outside component)
const generateRandomId = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const UserDetailsForm: React.FC = () => {
  const [userDetails, setUserDetails] =
    useState<UserDetails>(initialUserDetails);
  const [errors, setErrors] = useState<
    Partial<UserDetails & { email: string }>
  >({});
  // const { user } = useAuth();
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId: string = sessionData.id;
  console.log(userId);
  
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);




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
      if (value === "" && key !== "address_line_2") {
        console.log(`${key} validation failed`);
        newErrors[key as keyof UserDetails] = `${key.replace(
          "_",
          " "
        )} is required`;
        isValid = false;
      }
    });

    if (userDetails.pincode.length !== 6) {
      if (isNaN(Number(userDetails.pincode))) {
        newErrors.pincode = "Pincode invalid";
        isValid = false;
      }
      newErrors.pincode = "Pincode should be 6 digits";
      isValid = false;
    }

    if (userDetails.phone_number.length !== 10) {
      console.log("Phone number validation failed");
      newErrors.phone_number = "Phone number should be 10 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all the required fields correctly");
      return;
    }

    const userDetailsToSend = {
      firstName: userDetails.first_name,
      lastName: userDetails.last_name,
      phoneNumber: userDetails.phone_number,
      address1: userDetails.address_line_1,
      address2: userDetails.address_line_2,
      city: userDetails.city,
      state: userDetails.state,
      pincode: userDetails.pincode,
      country: userDetails.country,
      comments: userDetails.comments,
      avatarUrl: "",
      salutation: userDetails.salutation,
      uniqueId: parseInt(userDetails.unique_id)
    };

    setLoading(true);
    try {
      const res = await fetch("/api/addprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalInfo: userDetailsToSend,
          userId,
          newUserEmail: email,
          newUserPhone: userDetails.phone_number,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        if (data.error) {
          toast.error(data.error);
          return;
        }

        await fetch("/api/googlesheets/addrow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetailsToSend),
        });

        toast.success("Profile added successfully");
        setUserDetails(initialUserDetails);
        setEmail("");
      } else {
        const errorData = await res.json();
        console.error("Error:", errorData);
        toast.error("Failed to add profile. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    name: keyof UserDetails,
    label: string,
    type: string = "text",
    options?: string[]
  ) => (
    <div className="mb-4">
      {type === "select" ? (
        <FloatingSelect
          id={name}
          value={userDetails[name]}
          onChange={(value) => handleChange({
            target: { name, value },
          } as React.ChangeEvent<HTMLInputElement>)}
          label={label}
        >
          {options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </FloatingSelect>
      ) : type === "textarea" ? (
        <FloatingTextarea
          id={name}
          name={name}
          value={userDetails[name]}
          onChange={handleChange}
          label={label}
        />
      ) : (
        <FloatingLabelInput
          type={type}
          id={name}
          name={name}
          label={label}
          value={userDetails[name]}
          onChange={handleChange}
          maxLength={
            name === "phone_number" ? 10 : name === "pincode" ? 6 : undefined
          }
          className={`w-full ${
            errors[name] ? "ring-2 ring-red-500" : "focus:ring-blue-500"
          }`}
        />
      )}
      {errors[name] && <p className="text-red-500">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdf0f4]">
      <div className="w-full max-w-lg mx-auto p-4">
        <div className="bg-white rounded-xl shadow-md border border-[#663399]/20 p-4">
          {/* Header Section */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-bold text-[#663399] flex items-center justify-center gap-2">
              <MdGroupAdd />
              Add User
            </h1>
            <p className="text-sm text-gray-600">
              Fill in the details of the new user 
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Section */}
            <div className="relative">
              <FloatingLabelInput
                type="email"
                id="email"
                name="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-[#663399]/20 rounded-lg text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
            {renderField("unique_id", "Unique ID")}
            </div>

            {/* Name Section */}
            <div className="flex gap-3">
              <div className="w-1/3">
                {renderField("salutation", "Salutation", "select", [
                  "Mr.", "Ms.", "Mrs.", "Dr.", "Prof.", "Mx.",
                ])}
              </div>
              <div className="w-2/3">
                {renderField("first_name", "First Name")}
              </div>
            </div>

            {/* Other Personal Details */}
            <div className="space-y-4">
              {renderField("last_name", "Last Name")}
              
              {/* Unique ID Section */}

              {renderField("phone_number", "Phone Number")}
            </div>

            {/* Address Section */}
            <div className="space-y-4 pt-2">
              <div className="text-sm font-medium text-[#663399]/80 pb-1">Address Details</div>
              {renderField("address_line_1", "Address Line 1")}
              {renderField("address_line_2", "Address Line 2")}
              
              <div className="flex gap-3">
                <div className="w-1/2">{renderField("city", "City")}</div>
                <div className="w-1/2">{renderField("state", "State")}</div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-1/2">{renderField("pincode", "Pin Code")}</div>
                <div className="w-1/2">{renderField("country", "Country")}</div>
              </div>
            </div>

            {/* Comments Section */}
            {/* <div className="pt-2">
              {renderField("comments", "Additional Comments", "textarea")}
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-medium 
                       bg-[#663399] hover:bg-[#663399]/90 text-white rounded-lg
                       transition-all duration-200 mt-6
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Creating Profile...</span>
                </div>
              ) : (
                "Create Profile"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const userDetailsForm = () => {
  return <UserDetailsForm />;
};

export default withProfileCheck(userDetailsForm);
