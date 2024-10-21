"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../../Firebase/Firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  role: string[]; 
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, role: [] });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        const fetchUserRole = async () => {
          try {
            const response = await fetch('/api/auth', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: user.email }),
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

        fetchUserRole();
      } else {
        setRole([]); 
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, role }}>
      {children}
    </AuthContext.Provider>
  );
};
