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
    comments: '',
  };

 export interface Post {
    id: string;
    title: string;
    content: string;
    likes: number;
    dislikes: number;
    createdAt: string;
    comments: Comment[];
    image: string | null;
    author: {
      id:string;
      personalInfo: {
        firstName: string;
        avatarUrl: string;
      };
    };
    userInteraction?: 'like' | 'dislike' | 'none';
    likedBy: { id: string }[];
    dislikedBy: { id: string }[];
  }