"use client"
import React, { useEffect, useState } from 'react';
import { UserDetails } from '../../utils/type';
import { initialUserDetails } from '../../utils/type';
import { useAuth } from '../context/AuthContext';
import { FaUserEdit } from 'react-icons/fa';
import { CgDetailsMore } from 'react-icons/cg';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"




const UserDetailsForm: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>(initialUserDetails);
  const [errors, setErrors] = useState<Partial<UserDetails>>({});
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const getData = async () => {
    const data = await fetch(`/api/userDetails?email=${user?.email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const res = await data.json();
    console.log(res.userDetails, "response113333");
    if (res.userDetails) {
      setUserDetails({
        salutation: res.userDetails.salutation,
        first_name: res.userDetails.firstName,
        last_name: res.userDetails.lastName,
        phone_number: res.userDetails.phoneNumber,
        address_line_1: res.userDetails.address1,
        address_line_2: res.userDetails.address2,
        city: res.userDetails.city,
        state: res.userDetails.state,
        country: res.userDetails.country,
        pincode: res.userDetails.pincode,
        comments: res.userDetails.comments
      });
      setIsEditable(false); // Initially, the form should be non-editable
    } else {
      setIsEditable(true); // If no data, the form should be editable
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone_number' && isNaN(Number(value))) return;
    setUserDetails(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetails> = {};
    let isValid = true;

    Object.entries(userDetails).forEach(([key, value]) => {
      if (value === '') {
        newErrors[key as keyof UserDetails] = `${key.replace('_', ' ')} is required`;
        isValid = false;
      }
    });


    if (userDetails.pincode.length !== 6) {
      if (isNaN(Number(userDetails.pincode))) {
        newErrors.pincode = 'Pincode invalid';
        isValid = false;
      }
      newErrors.pincode = 'Pincode should be 6 digits';
      isValid = false;
    }

    if (userDetails.phone_number.length !== 10) {
      newErrors.phone_number = 'Phone number should be 10 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
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
          salutation: userDetails.salutation,
          email: user?.email,
          avatarUrl: user?.photoURL
        };
        const res = await fetch('/api/userDetails', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userDetailsToSend)
        });
        if (res.status === 200) {
          toast.success('Details updated successfully!');
        } else {
          toast.error('Failed to update details.');
        }
      } catch (error) {
        toast.error('Error: ' + error);
      } finally {
        setLoading(false);
        setIsEditable(false); // After updating, set the form to non-editable
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEditable) {
      toast.error('Please click the "Edit" button to edit your details.');
      return;
    }
    if (validateForm()) {
      setLoading(true);
      try {
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
          email: user?.email,
          avatarUrl: user?.photoURL,
          salutation: userDetails.salutation
        };
        const res = await fetch('/api/userDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userDetailsToSend)
        });
        if (res.status === 200) {
          toast.success('Details submitted successfully!');
          setIsEditable(false); // After submitting, set the form to non-editable
        } else {
          toast.error('Failed to submit details.');
        }
      } catch (error) {
        toast.error('Error: ' + error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderField = (name: keyof UserDetails, label: string, type: string = 'text', options?: string[]) => (
    <div className="mb-4">
      <label className="block font-semibold text-md text-[#233543] mb-1">{label}</label>
      {type === 'select' ? (
          <Select
          value={userDetails[name]}
          onValueChange={(value) => handleChange({ target: { name, value } } as React.ChangeEvent<HTMLSelectElement>)}
          disabled={!isEditable}
        >
          <SelectTrigger className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${errors[name] ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              {options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          placeholder={`Enter ${label}`}
          value={userDetails[name]}
          onChange={handleChange}
          disabled={!isEditable}
          className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${errors[name] ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={`Enter ${label === "Address Line 1" ? "Door No" : label === "Address Line 2" ? "Street Name" : label}`}
          value={userDetails[name]}
          onChange={handleChange}
          disabled={!isEditable}
          maxLength={name === 'phone_number' ? 10 : name === 'pincode' ? 6 : undefined}
          className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${errors[name] ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
        />
      )}
      {errors[name] && <p className="text-red-500">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="flex justify-center items-center max-w-screen min-h-screen bg-[#fdf0f4]">
      <div className="bg-white shadow-xl rounded-xl h-fit mb-10 md:w-[75%] w-[90%] p-4 md:px-9 px-5 mt-5">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-red-600 flex gap-x-2 items-center"> Your Details <CgDetailsMore /> </h1>
          {Object.keys(userDetails).some(key => userDetails[key as keyof UserDetails]) && (
            <button
              type="button"
              onClick={() => setIsEditable(!isEditable)}
              className="font-medium p-2 w-fit h-fit px-4 bg-red-500 hover:bg-red-700 text-white rounded-md flex items-center gap-x-3"
            >
              {!isEditable ? ' Edit' : 'Cancel'} <FaUserEdit />
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          {renderField('salutation', 'Salutation', 'select', ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.', 'Mx.'])}
          {renderField('first_name', 'First Name')}
          {renderField('last_name', 'Last Name')}
          {renderField('phone_number', 'Phone Number')}
          {renderField('address_line_1', 'Address Line 1')}
          {renderField('address_line_2', 'Address Line 2')}
          {renderField('city', 'City')}
          {renderField('state', 'State')}
          {renderField('pincode', 'Pin Code')}
          {renderField('country', 'Country')}
          {renderField('comments', 'Comments', 'textarea')}
          <div className="flex justify-start items-center mt-7 mb-4">
            {isEditable ? (
              <button
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                className={`font-semibold p-2 bg-violet-600 hover:bg-violet-800 text-white rounded-md ${loading ? 'cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </div>
                ) : (
                  'Update Details'
                )}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`font-semibold p-2 bg-violet-600 hover:bg-violet-800 text-white rounded-md ${loading ? 'cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit'
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