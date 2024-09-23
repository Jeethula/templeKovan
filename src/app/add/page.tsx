"use client"
import React, { useState } from 'react';
import { UserDetails, initialUserDetails } from '../../utils/type';
import { useAuth } from '../context/AuthContext';

const UserDetailsForm: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>(initialUserDetails);
  const [errors, setErrors] = useState<Partial<UserDetails & { email: string }>>({});
  const { user } = useAuth();
  const [email, setEmail] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone_number' && isNaN(Number(value))) return;
    setUserDetails(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetails > = {};
    let isValid = true;
  
    Object.entries(userDetails).forEach(([key, value]) => {
      if (value === '' && key !== 'address_line_2') {
        console.log(`${key} validation failed`);
        newErrors[key as keyof UserDetails] = `${key.replace('_', ' ')} is required`;
        isValid = false;
      }
    });
  
    if (userDetails.pincode.length !== 6) {
      console.log("Pincode validation failed");
      newErrors.pincode = 'Pincode should be 6 digits';
      isValid = false;
    }
  
    if (userDetails.phone_number.length !== 10) {
      console.log("Phone number validation failed");
      newErrors.phone_number = 'Phone number should be 10 digits';
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      window.alert('Please fill all the required fields correctly');
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
      avatarUrl: user?.photoURL || '',
      salutation: userDetails.salutation,
    };

    try {
      const res = await fetch('/api/addprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalInfo: userDetailsToSend,
          referrerEmail: user?.email,
          newUserEmail: email
        })
      });

      if (res.ok) {
        const data = await res.json();
        window.alert('Profile added successfully');
        setUserDetails(initialUserDetails);
        setEmail('');
      } else {
        const errorData = await res.json();
        console.error('Error:', errorData);
        window.alert('Failed to add profile. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      window.alert('Network error. Please check your connection and try again.');
    }
  };

  const renderField = (name: keyof UserDetails, label: string, type: string = 'text', options?: string[]) => (
    <div className="mb-4">
      <label className="block font-semibold text-sm text-black mb-1">{label.toUpperCase()}</label>
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
          placeholder={`Enter ${label}`}
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
    <div className="flex justify-center items-center max-w-screen min-h-screen bg-white">
      <div className="bg-white h-fit w-[75%] p-4 mt-5">
        <h1 className="text-2xl font-bold mb-8">User Details</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold text-sm text-black mb-1">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'}`}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
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
          <div className="flex justify-end items-center mt-7 mb-4">
            <button type="submit" className="font-semibold px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsForm;