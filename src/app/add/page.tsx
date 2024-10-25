"use client";
import React, { useState } from "react";
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

  const [isUniqueIdVerified, setIsUniqueIdVerified] = useState<boolean>(false);
  const [uniqueIdCheckMessage, setUniqueIdCheckMessage] = useState<string>("");

  const handleUniqueIdCheck = async () => {
    try {
      const res = await fetch("/api/checkuniqueid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uniqueId: parseInt(userDetails.unique_id) }),
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
    if (!isUniqueIdVerified) {
      toast.error("Please verify the Unique ID");
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
    <div className="flex justify-center items-center bg-[#fdf0f4] max-w-screen min-h-screen">
      <div className="bg-white shadow-xl mt-5 mb-10 px-5 md:px-9 p-4 rounded-xl w-[90%] md:w-[75%] h-fit">
        <h1 className="flex items-center gap-x-3 mb-8 font-bold text-2xl text-red-500">
          <MdGroupAdd />
          Add User{" "}
        </h1>
        <p className="mb-5 text-gray-500 text-wrap">
          Fill in the details of the new user in the form below, who will be
          your referral.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <FloatingLabelInput
              type="email"
              id="email"
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full ${
                errors.email ? "ring-2 ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          {renderField("salutation", "Salutation", "select", [
            "Mr.",
            "Ms.",
            "Mrs.",
            "Dr.",
            "Prof.",
            "Mx.",
          ])}
          {renderField("first_name", "First Name")}
          {renderField("last_name", "Last Name")}
          {renderField("unique_id", "Unique ID")}
         <div className="flex items-center gap-x-2">
          <button
            type="button"
            onClick={handleUniqueIdCheck}
            className="bg-blue-500 hover:bg-blue-700 mb-3 ml-2 px-3 py-1 rounded-md font-semibold text-white"
          >
            Check
          </button> <h1 className="font-medium">
            Check Availablity!</h1> </div>
          {uniqueIdCheckMessage && (
            <p className={` mb-4 text-${isUniqueIdVerified ? "green" : "red"}-600`}>
             {isUniqueIdVerified ? '✅' : '❌'} {uniqueIdCheckMessage}
            </p>
          )}
          {renderField("phone_number", "Phone Number")}
          {renderField("address_line_1", "Address Line 1")}
          {renderField("address_line_2", "Address Line 2")}
          {renderField("city", "City")}
          {renderField("state", "State")}
          {renderField("pincode", "Pin Code")}
          {renderField("country", "Country")}
          {renderField("comments", "Comments", "textarea")}
          <div className="flex justify-start items-center mt-7 mb-4">
            <button
              type="submit"
              disabled={loading}
              className={`font-semibold p-2 bg-violet-600 hover:bg-violet-800 text-white rounded-md ${
                loading ? "cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="mr-3 -ml-1 w-5 h-5 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Profile...
                </div>
              ) : (
                "Create Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const userDetailsForm = () => {
  return <UserDetailsForm />;
};

export default withProfileCheck(userDetailsForm);
