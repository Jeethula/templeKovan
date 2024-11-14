// // lib/fetch.js
// import { useRouter } from 'next/navigation';

// const API_BASE_URL = '/api';

// interface FetchOptions extends RequestInit {
//   headers?: Record<string, string>;
// }

// export const customFetch = async (url: string, options: FetchOptions = {}) => {
//   const token = localStorage.getItem('user');
//   const router = useRouter();

//   if (!token) {
//     router.push('/login');
//     throw new Error('No token found');
//   }

//   const defaultOptions = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     },
//   };

//   const response = await fetch(`${API_BASE_URL}${url}`, { ...defaultOptions, ...options });

//   if (response.status === 401) {
//     localStorage.removeItem('user');
//     router.push('/login');
//     throw new Error('Token expired');
//   }

//   return response.json();
// };