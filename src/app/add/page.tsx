"use client";
import React, { useState } from "react";
import { UserDetails, initialUserDetails } from "../../utils/type";
import { useAuth } from "../context/AuthContext";
import { MdGroupAdd } from "react-icons/md";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import withProfileCheck from "@/components/withProfileCheck";

const UserDetailsForm: React.FC = () => {
  const [userDetails, setUserDetails] =
    useState<UserDetails>(initialUserDetails);
  const [errors, setErrors] = useState<
    Partial<UserDetails & { email: string }>
  >({});
  const { user } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const validateUniqueId = (uniqueId: string): boolean => {
    const regex = /^\d{4}[A-Za-z]{4}\d{2}$/;
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
      avatarUrl: user?.photoURL || "",
      salutation: userDetails.salutation,
      uniqueId: userDetails.unique_id,
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
          referrerEmail: user?.email,
          newUserEmail: email,
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
      <label className="block font-semibold text-sm text-black mb-1">
        {label}
      </label>
      {type === "select" ? (
        <Select
          value={userDetails[name]}
          onValueChange={(value) =>
            handleChange({
              target: { name, value },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        >
          <SelectTrigger
            className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
              errors[name] ? "ring-2 ring-red-500" : "focus:ring-blue-500"
            }`}
          >
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              {options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          placeholder={`Enter ${label}`}
          value={userDetails[name]}
          onChange={handleChange}
          className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
            errors[name] ? "ring-2 ring-red-500" : "focus:ring-blue-500"
          }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={`Enter ${
            label === "Address Line 1"
              ? "Door No"
              : label === "Address Line 2"
              ? "Street Name"
              : label
          }`}
          value={userDetails[name]}
          onChange={handleChange}
          maxLength={
            name === "phone_number" ? 10 : name === "pincode" ? 6 : undefined
          }
          className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
            errors[name] ? "ring-2 ring-red-500" : "focus:ring-blue-500"
          }`}
        />
      )}
      {errors[name] && <p className="text-red-500">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="flex justify-center  items-center max-w-screen min-h-screen bg-[#fdf0f4]">
      <div className="bg-white shadow-xl rounded-xl h-fit mb-10 md:w-[75%] w-[90%] p-4 md:px-9 px-5 mt-5">
        <h1 className="text-2xl font-bold mb-8 text-red-500 flex gap-x-3 items-center">
          <MdGroupAdd />
          Add User{" "}
        </h1>
        <p className="text-gray-500 text-wrap mb-5">
          Fill in the details of the new user in the form below, who will be
          your referral.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold text-sm text-[#233543] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="New User Email"
              className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
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
         <div className="flex items-center gap-x-2 ">
          <button
            type="button"
            onClick={handleUniqueIdCheck}
            className="ml-2 px-3 py-1 mb-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700"
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
