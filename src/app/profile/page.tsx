"use client"
import React, { useEffect, useState } from 'react';
import { UserDetails }from '../../utils/type'
import {initialUserDetails} from '../../utils/type'
import { useAuth } from '../context/AuthContext';
import { FaUserEdit } from 'react-icons/fa';


const UserDetailsForm: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>(initialUserDetails);
  const [errors, setErrors] = useState<Partial<UserDetails>>({});
  const [isupdate, setIsupdate] = useState<boolean>(false);
  const {user} = useAuth();

  const getadata = async () => {
    const data = await fetch(`/api/userDetails?email=${user?.email}`,{
      method:'GET',
      headers:{
        'Content-Type':'application/json'
      },
    })
    const res = await data.json();
    console.log(res.userDetails,"response113333");
    if(res.userDetails){
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
    setIsupdate(true);
    }
  }

  useEffect(() => {
    getadata();
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
      console.log('Form updated:', userDetails);
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
        avatarUrl:user?.photoURL
      };
        const res = await  fetch('/api/userDetails',{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(userDetailsToSend)
        })
        console.log(res,"response");
    }
  }

  const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', userDetails);
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
        avatarUrl:user?.photoURL
      };
        const res = await  fetch('/api/userDetails',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(userDetailsToSend)
        })
        if(res.status === 200){
          setIsupdate(true);
        }else{
          setIsupdate(false);
        }
    }
  };

  const renderField = (name: keyof UserDetails, label: string, type: string = 'text', options?: string[]) => (
    <div className="mb-4">
      <label className="block font-semibold text-md text-[#233543] mb-1">{label}</label>
      {type === 'select' ? (
        <select
          name={name}
          value={userDetails[name]}
          onChange={handleChange}
          className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${errors[name] ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
        >
          <option value="">Select</option>
          {options?.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          placeholder={`Enter ${label}`}
          value={userDetails[name]}
          onChange={handleChange}
          className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${errors[name] ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={`Enter ${label === "Address Line 1" ? "Door No" : label === "Address Line 2" ? "Street Name" : label}`}
          value={userDetails[name]}
          onChange={handleChange}
          maxLength={name === 'phone_number' ? 10 : name === 'pincode' ? 6 : undefined}
          className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${errors[name] ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
        />
      )}
      {errors[name] && <p className="text-red-500">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="flex justify-center  items-center max-w-screen min-h-screen bg-[#fdf0f4]"> 
      <div className="bg-white shadow-xl rounded-xl h-fit mb-10 md:w-[75%] w-[90%] p-4 md:px-9 px-5 mt-5">
        <h1 className="text-2xl font-bold mb-8 text-orange-600 flex gap-x-3 items-center"><FaUserEdit /> Your Details </h1>
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
           { !isupdate && <button type="submit" className="font-semibold p-2 bg-violet-600 hover:bg-violet-800  text-white rounded-md">Submit</button>}
           { isupdate && <div onClick={handleUpdate} className="cursor-pointer font-semibold p-2 bg-violet-600 hover:bg-violet-800   text-white rounded-md">Update Details</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsForm;