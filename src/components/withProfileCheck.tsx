import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import toast from 'react-hot-toast';

const withProfileCheck = (WrappedComponent: React.ComponentType) => {
  const ProfileCheck = (props: React.ComponentProps<typeof WrappedComponent>) => {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
      const checkProfileCompletion = async () => {
        if (typeof user !== 'string' && user?.email) {
          try {
            const userId = JSON.parse(sessionStorage.getItem('user') || '{}').id;
            const response = await fetch(`/api/userDetails?userId=${userId}`);
            
            if (!response.ok) {
              throw new Error('Failed to fetch user details');
            }

            const data = await response.json();

            if (!data.userDetails) {
              toast.success('Please complete your profile to continue');
              router.push('/profile?redirect=blog');
            }
          } catch (error) {
            console.error('Error fetching profile details:', error);
            toast.error('An error occurred. Please try again.');
          }
        } else {
          router.push('/login');
        }
      };

      checkProfileCompletion();
    }, [user, router]);

    return <WrappedComponent {...props} />;
  };

  return ProfileCheck;
};

export default withProfileCheck;
