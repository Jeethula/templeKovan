"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../../Firebase/Firebase';
import { useRouter } from 'next/navigation';
import { clearLine } from 'readline';

type Userdata = {
  phoneNumber: string;
  email?: string;
  photoURL?: string;
};

type AuthContextType = {
  user: User | null | string | Userdata;
  loading: boolean;
  role: string[];
  setRole: React.Dispatch<React.SetStateAction<string[]>>;
  setUser: React.Dispatch<React.SetStateAction<User | null | string | Userdata>>;
  signOut: () => Promise<void>;
};


const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  role: [],
  setUser: () => {},
  setRole: () => {},
  signOut: async () => {}, 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null | string | Userdata>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchUserRole(firebaseUser.email);
      } else {
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
          const userData = JSON.parse(sessionUser) as Userdata;
          setUser(userData);
          fetchUserRole(userData.phoneNumber);
        } else {
          setUser(null);
          setRole([]);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (identifier: string | null) => {
    if (!identifier) return;

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier }),
      });
      const data = await response.json();
      const userFromStorage = data.user;
      console.log(userFromStorage, "userFromStorage");
      setRole(userFromStorage.role);
      sessionStorage.setItem('user', JSON.stringify(userFromStorage));
    } catch (error) {
      console.error("Error fetching user role:", error);
      setRole([]);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      sessionStorage.removeItem('user');
      setUser(null);
      setRole([]);
      router.push('/');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  // const getUserEmail = () => {
  //   if (typeof user !== "string" && user && "email" in user) {
  //     return user.email;
  //   }
  //   return null;
  // };

  return (
    <AuthContext.Provider value={{ user, loading, role, setRole, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
