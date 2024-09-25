// "use client"
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { signInWithPopup } from 'firebase/auth';
// import { auth, provider } from '../Firebase/Firebase';
// const Login = () => {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         router.push('/');
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     try {
//       await signInWithPopup(auth, provider);
//       // Redirect is handled by the useEffect hook
//     } catch (error) {
//       console.error('Error signing in with Google', error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="p-6 bg-white rounded shadow-md">
//         <h1 className="mb-4 text-2xl font-bold text-center">Welcome</h1>
//         <button
//           onClick={handleGoogleSignIn}
//           disabled={loading}
//           className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
//         >
//           {loading ? 'Signing in...' : 'Sign in with Google'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;

"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Firebase/Firebase';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        handleUserAuth(user);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleUserAuth = async (user) => {
    try {
      const response = await fetch('/api/auth/google-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          phoneNumber: user.phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate user');
      }

      const userData = await response.json();
      // Here you can store user data in your app's state or context
      console.log('User data:', userData);

      router.push('/');
    } catch (error) {
      console.error('Error authenticating user:', error);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      // The useEffect hook will handle the rest
    } catch (error) {
      console.error('Error signing in with Google', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center">Welcome</h1>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};

export default Login;