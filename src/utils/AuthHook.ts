// hooks/useAuthCheck.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuthCheck = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('user');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const tokenData = JSON.parse(token);
        const tokenExpiration = new Date(tokenData.exp * 1000);
        
        if (new Date() > tokenExpiration) {
          // Token expired
          localStorage.removeItem('user');
          sessionStorage.removeItem('user');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/login');
      }
    };

    checkAuth();

    // Optional: Check periodically
    const interval = setInterval(checkAuth, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [router]);
};