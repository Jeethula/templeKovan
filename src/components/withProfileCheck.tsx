// components/withProfileCheck.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/context/AuthContext';
import toast from 'react-hot-toast';

const withProfileCheck = (WrappedComponent: React.ComponentType) => {
  const ProfileCheck = (props: any) => {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
      const checkProfileCompletion = async () => {
        if (!user?.email) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/userDetails?email=${user.email}`);
        const data = await response.json();

        if (!data.userDetails) {
            toast.error('Please complete your profile to continue');
          router.push('/profile?redirect=blog');
        }
      };

      checkProfileCompletion();
    }, [user, router]);

    return <WrappedComponent {...props} />;
  };

  return ProfileCheck;
};

export default withProfileCheck;