"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../../Firebase/Firebase';


type Userdata = {
  phoneNumber: string;
};

type AuthContextType = {
  user: User | null | string | Userdata;
  loading: boolean;
  role: string[];
  setUser: React.Dispatch<React.SetStateAction<User | null | string | Userdata>>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  role: [],
  setUser: () => {},
  signOut: async () => {}, 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
          const userData = JSON.parse(sessionUser);
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
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
