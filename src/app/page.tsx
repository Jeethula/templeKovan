"use client";
import { useAuth } from '../app/context/AuthContext';
import Login from '../components/Login';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/Firebase';

const Home = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-4 text-2xl font-bold">Welcome to the Home Page</h1>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
};

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
};

export default function HomePage() {
  return (
    <AuthWrapper>
      <Home />
    </AuthWrapper>
  );
}