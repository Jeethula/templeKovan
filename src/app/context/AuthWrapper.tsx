"use client";
import { useAuth } from './AuthContext';
import Login from '../../components/Login';

export default function AuthWrapper ({ children }: { children: React.ReactNode })  {

  const { user, loading } = useAuth();
  console.log(user?.email,"123");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
};