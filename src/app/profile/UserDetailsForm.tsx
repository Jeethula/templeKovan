"use client";
import React, { useEffect, useState } from "react";
import { UserDetails } from "../../utils/type";
import { initialUserDetails } from "../../utils/type";
import { useAuth } from "../context/AuthContext";
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
        <SelectTrigger className="w-full peer text-black">
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

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
  onProfileCompletion,
}) => {
  const [userDetails, setUserDetails] =
    useState<UserDetails>(initialUserDetails);
  const [errors, setErrors] = useState<Partial<UserDetails>>({});
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { user } = useAuth();
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

  const UserDetails = async () => {
    const data = await fetch('/api/auth',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        email:user?.email
    })
    })
    const res = await data.json();
    console.log(res,"from page");
    sessionStorage.setItem('user',JSON.stringify(res.user));
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        await UserDetails();
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        if (user) {
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
      if (value === "") {
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
          comments: userDetails.comments,
          salutation: userDetails.salutation,
          avatarUrl: user?.photoURL,
          uniqueId: parseInt(userDetails?.unique_id),
          userId: userID,
          email: user?.email,
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
          comments: userDetails.comments,
          email: user?.email,
          avatarUrl: user?.photoURL,
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
          onValueChange={(value: string) => handleChange({
            target: { name, value },
          } as React.ChangeEvent<HTMLInputElement>)}
          disabled={!isEditable}
          label={label}
        >
          <SelectItem value="default">Select {label}</SelectItem>
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
          disabled={!isEditable}
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
          disabled={!isEditable}
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
    <div className="flex justify-center items-center max-w-screen min-h-screen bg-[#fdf0f4]">
      <div className="bg-white shadow-xl rounded-xl h-fit mb-10 md:w-[75%] w-[90%] p-4 md:px-9 px-5 mt-5">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-red-600 flex gap-x-2 items-center">
            {" "}
            Your Details <CgDetailsMore />{" "}
          </h1>
          {Object.keys(userDetails).some(
            (key) => userDetails[key as keyof UserDetails]
          ) && (
            <button
              type="button"
              onClick={() => setIsEditable(!isEditable)}
              className="font-medium p-2 w-fit h-fit px-4 bg-red-500 hover:bg-red-700 text-white rounded-md flex items-center gap-x-3"
            >
              {!isEditable ? " Edit" : "Cancel"} <FaUserEdit />
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit}>
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
          <div className="flex items-center gap-x-2 ">
            <button
              type="button"
              onClick={handleUniqueIdCheck}
              disabled={!isEditable}
              className={`ml-2 px-3 py-1 mb-3 ${
                !isEditable
                  ? "bg-gray-300 text-black "
                  : "bg-blue-500 hover:bg-blue-700 text-white"
              }  font-semibold rounded-md `}
            >
              Check
            </button>{" "}
            <h1 className={`font-medium ${!isEditable ? "hidden" : ""}`}>
              Check Availablity!
            </h1>{" "}
          </div>
          {uniqueIdCheckMessage && (
            <p
              className={` mb-4 px-2 text-${
                isUniqueIdVerified ? "green" : "red"
              }-600`}
            >
              {isUniqueIdVerified ? "✅" : "❌"} {uniqueIdCheckMessage}
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
            {isEditable  && isSubmitted && (
              <button
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                className={`font-semibold p-2 bg-violet-600 hover:bg-violet-800 text-white rounded-md ${
                  loading ? "cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Updating...
                  </div>
                ) : (
                  "Update Details"
                )}
              </button>
            )}
            {isEditable && !isSubmitted && (
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
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Submitting...
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsForm;