import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

// Backend endpoint that handles Google OAuth
const GOOGLE_BACKEND_URL = 'http://localhost:5000/api/auth/google/callback';

export const useGoogleSignIn = () => {
  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: () => {
      // This won't be called in redirect flow
      console.log('Redirecting to Google...');
    },
    onError: (error) => {
      console.error('Google Sign-In failed:', error);
      toast.error('Google Sign-In was cancelled or failed', {
        position: 'top-right',
        autoClose: 4000,
      });
    },
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: GOOGLE_BACKEND_URL,
  });

  return { handleGoogleSignIn };
};
