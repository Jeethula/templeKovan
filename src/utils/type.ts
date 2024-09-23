export interface UserDetails{
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
 
export interface Error{
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

export const initialUserDetails: UserDetails = {
    salutation: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    comments: ''
  };