"use client"
import React,{ useState } from "react";
 
interface UserDetails{
    salutation:string;
    first_name:string;
    last_name:string;
    phone_number:string;
    address_line_1:string;
    address_line_2:string;
    city:string;
    state:string;
    country:string;
    pincode:string;
    comments:string;
}
 
interface Error{
    salutation:string;
    first_name:string;
    last_name:string;
    phone_number:string;
    address_line_1:string;
    address_line_2:string;
    city:string;
    state:string;
    country:string;
    pincode:string;
    comments:string;
}
 
 
export default function forms() {
        const [userDetails,setUserDetails]=useState<UserDetails>({salutation:'',first_name:'',last_name:'',phone_number:'',address_line_1:'',address_line_2:'',city:'',state:'',country:'',pincode:'',comments:''});
 
        const [error,setError]=useState<Error>({salutation:'',first_name:'',last_name:'',phone_number:'',address_line_1:'',address_line_2:'',city:'',state:'',country:'',pincode:'',comments:''});
 
       let errorStatus:boolean=false;
 
        const handleChange=(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
            console.log(e.target.name);
            console.log(e.target.value);
            if(e.target.name=='phone_number')
            {
                if(isNaN(Number(e.target.value)))
                {
                    return
                }
            }
            setUserDetails((prev)=>({...prev,[e.target.name]:e.target.value}));
            console.log(userDetails);
        }
 
        const handleSubmit=(e: React.FormEvent<HTMLFormElement>)=>{
            e.preventDefault();
            if(error.salutation==''||error.first_name==''||error.last_name==''||error.phone_number==''||error.address_line_1==''||error.address_line_2==''||error.city==''||error.state==''||error.country==''||error.pincode==''||error.comments=='')
            {
                if(userDetails.salutation=='')
                {
                    setError((prev)=>({...prev,salutation:'Salutation is required'}));
                }
                if(userDetails.first_name=='')
                {
                    setError((prev)=>({...prev,first_name:'First name is required'}));
                }
                if(userDetails.last_name=='')
                {
                    setError((prev)=>({...prev,last_name:'Last name is required'}))
                }
 
                if(userDetails.phone_number=='')
                {
                    setError((prev)=>({...prev,phone_number:'Phone number is required'}))
                }
                if(userDetails.address_line_1=='')
                {
                    setError((prev)=>({...prev,address_line_1:'Address 1 is required'}))
                }
                if(userDetails.address_line_2=='')
                {
                    setError((prev)=>({...prev,address_line_2:'Address 2 is required'}))
                }
                if(userDetails.city=='')
                {
                    setError((prev)=>({...prev,city:'City is required'}))
                }
                if(userDetails.state=='')
                {
                    setError((prev)=>({...prev,state:'State is required'}))
                }
                if(userDetails.country=='')
                {
                    setError((prev)=>({...prev,country:'Country is required'}))
                }
                if(userDetails.pincode=='')
                {
                    setError((prev)=>({...prev,pincode:'Pincode is required'}))
                }
                errorStatus=true;
                return
            }
            if(userDetails.pincode.length!=6)
            {
                setError((prev)=>({...prev,pincode:'Pincode should be of 6 digits'}));
                errorStatus=true;
            }
            if(userDetails.phone_number.length!=10)
            {
                setError((prev)=>({...prev,phone_number:'Phone number should be of 10 digits'}));
                errorStatus=true;
            }
            if(errorStatus)
            {
                return
            }
 
        }
 
    return(
        <div>
            <div className="flex justify-center items-center max-w-screen min-h-screen bg-white">
                <div className="bg-white h-fit w-[75%] p-4 mt-5">
                    <h1 className="text-2xl font-bold mb-8">Add Another Person</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-semibold text-sm text-black mb-1">SALUTATION</label>
                            <select
                                name="salutation"
                                value={userDetails.salutation}
                                onChange={handleChange}
                                onFocus={(e)=>setError((prev)=>({...prev,salutation:''}))}
                                className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${error.salutation!=''?('ring-2 ring-red-500'):('focus:ring-blue-500')}`}
                            >
                                    <option value="">Select</option>
                                    <option value="Mr.">Mr.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    <option value="Dr.">Dr.</option>
                                    <option value="Prof.">Prof.</option>
                                    <option value="Mx.">Mx.</option>
                            </select>
                            {error.salutation&&<p className="text-red-500">{error.salutation}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block font-semibold text-sm text-black mb-1"> FIRST NAME</label>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="Enter First Name"
                                value={userDetails.first_name}
                                onChange={handleChange}
                                onFocus={(e)=>setError((prev)=>({...prev,first_name:''}))}
                                className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${error.first_name!=''?('ring-2 ring-red-500'):('focus:ring-blue-500')}`}
                            />
                            {error.first_name&&<p className="text-red-500">{error.first_name}</p>}
 
                        </div>
 
                        <div className="mb-4">
                            <label className="block font-semibold text-sm text-black mb-1">LAST NAME</label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Enter Last Name"
                                value={userDetails.last_name}
                                onChange={handleChange}
                                onFocus={(e)=>setError((prev)=>({...prev,last_name:''}))}
                                className={`w-full px-3 py-2 -fit mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${error.last_name!=''?('ring-2 ring-red-500'):('focus:ring-blue-500')}`}
                            />
                            {error.last_name&&<p className="text-red-500">{error.last_name}</p>}
 
                           
                        </div>
 
                        <div className="mb-4">
                            <label className="block font-semibold text-sm text-black mb-1">PHONE NUMBER</label>
                            <input
                                type="text"
                                name="phone_number"
                                placeholder="Enter Phone Number"
                                value={userDetails.phone_number}
                                maxLength={10}
                                onChange={handleChange}
                                onFocus={(e)=>setError((prev)=>({...prev,phone_number:''}))}
                                className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${error.phone_number!=''?('ring-2 ring-red-500'):('focus:ring-blue-500')}`}
                            />
                            {error.phone_number&&<p className="text-red-500">{error.phone_number}</p>}
                        </div>
 
                       
                        <div className="mb-4">
                            <label className="block font-semibold text-sm text-black mb-1" >ADDRESS LINE 1</label>
                            <input
                                type="text"
                                name="address_line_1"
                                placeholder="Enter Door Number, Apartment Name"
                                value={userDetails.address_line_1}
                                onChange={handleChange}
                                onFocus={(e)=>setError((prev)=>({...prev,address_line_1:''}))}
                                className={`w-full px-3 py-2  mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${error.address_line_1!=''?('ring-2 ring-red-500'):('focus:ring-blue-500')}`}
                            />
                            {error.address_line_1&&<p className="text-red-500">{error.address_line_1}</p>}
                        </div>
 
                        <div className="mb-4">
                            <label className="block font-semibold text-sm text-black mb-1" >ADDRESS LINE 2</label>
                            <input
                                type="text"
                                name="address_line_2"
                                placeholder="Enter Street Name, Area Name"
                                value={userDetails.address_line_2}
                                onChange={handleChange}
                                onFocus={(e)=>setError((prev)=>({...prev,address_line_2:''}))}
                                className={`w-full px-3 py-2 -fit mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${error.address_line_2!=''?('ring-2 ring-red-500'):('focus:ring-blue-500')}`}
                            />
                            {error.address_line_2&&<p className="text-red-500">{error.address_line_2}</p>}
                        </div>
 
                        <div className="mb-4">
                            <label className="block font-semibold text-sm text-black mb-1">CITY</label>
                            <input
                                type="text"
                                name="city"
                                placeholder="Enter City"
                                value={userDetails.city}
                                onChange={handleChange}
                                onFocus={(e)=>setError((prev)=>({...prev,city:''}))}
                                className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${error.city!=''?('ring-2 ring-red-500'):('focus:ring-blue-500')}`}
                             />
                             {error.city&&<p className="text-red-500">{error.city}</p>}
                        </div>
 
                        <div className="mb-4">
                            <label className="block font-semibold text-sm text-black mb-1">STATE</label>
                            <input
                                type="text"
                                name="state"
                                placeholder="Enter State"
                                value={userDetails.state}
                                onChange={handleChange}
                                onFocus={(e)=>setError((prev)=>({...prev,state:''}))}
                                className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${error.state!=''?('ring-2 ring-red-500'):('focus:ring-blue-500')}`}
                            />
                            {error.state&&<p className="text-red-500">{error.state}</p>}
                        </div>
 
                        <div className="mb-4">
                            <label className="block font-semibold text-sm text-black mb-1">PIN CODE</label>
                            <input
                                type="text"  
                                name="pincode"
                                placeholder="Enter Pincode"
                                value={userDetails.pincode}
                                onChange={handleChange}
                                onFocus={(e)=>setError((prev)=>({...prev,pincode:''}))}
                                className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${error.pincode!=''?('ring-2 ring-red-500'):('focus:ring-blue-500')}`}
                            />
                            {error.pincode&&<p className="text-red-500">{error.pincode}</p>}
                        </div>
 
                        <div className="mb-4">
                            <label className="block font-semibold text-sm text-black mb-1">COUNTRY</label>
                            <input
                                type="text"  
                                name="country"
                                placeholder="Enter Country"
                                value={userDetails.country}
                                onChange={handleChange}
                                onFocus={(e)=>setError((prev)=>({...prev,country:''}))}
                                className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${error.country!=''?('ring-2 ring-red-500'):('focus:ring-blue-500')}`}
                            />
                            {error.country&&<p className="text-red-500">{error.country}</p>}
                        </div>
 
 
                        <div className="mb-4">
                            <label className="block font-semibold text-sm text-black mb-1">COMMENTS</label>
                            <textarea
                                name="comments"
                                placeholder="Enter Comments"
                                value={userDetails.comments}
                                onChange={handleChange}
                                onFocus={(e)=>setError((prev)=>({...prev,comments:''}))}
                                className={`w-full px-3 py-2 mb-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${error.comments!=''?('ring-2 ring-red-500'):('focus:ring-blue-500')}`}
                            ></textarea>
                            {error.comments&&<p className="text-red-500">{error.comments}</p>}
                        </div>
 
 
 
                        <div className="flex justify-end items-center mt-7 mb-4">
                            <button type="submit" className="font-semibold px-2 py-1 bg-blue-500 text-white rounded-md">Submit</button>
                        </div>
 
                    </form>
 
                </div>
            </div>
        </div>
    )
}