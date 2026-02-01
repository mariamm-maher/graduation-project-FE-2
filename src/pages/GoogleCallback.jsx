import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth, updateUser } = useAuthStore();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract tokens and user data from URL parameters
        const accessToken = searchParams.get('accessToken');
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const firstName = searchParams.get('firstName');
        const lastName = searchParams.get('lastName');
        const needsRoleSelection = searchParams.get('needsRoleSelection') === 'true';
        const roles = searchParams.get('roles');
        const error = searchParams.get('error');

        // Handle error from backend
        if (error) {
          setStatus('error');
          setErrorMessage(decodeURIComponent(error));
          toast.error(decodeURIComponent(error), {
            position: 'top-right',
            autoClose: 5000,
          });
          
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        // Validate required parameters
        if (!accessToken || !userId || !email) {
          setStatus('error');
          setErrorMessage('Missing required authentication data');
          toast.error('Authentication failed: Missing data', {
            position: 'top-right',
            autoClose: 5000,
          });
          
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        // Parse roles
        let parsedRoles = [];
        if (roles) {
          try {
            parsedRoles = JSON.parse(decodeURIComponent(roles));
          } catch (e) {
            parsedRoles = roles.split(',');
          }
        }

        // Determine primary role
        const primaryRole = parsedRoles && parsedRoles.length > 0 ? parsedRoles[0] : null;
        const roleId = primaryRole === 'ADMIN' ? 3 
                     : primaryRole === 'CAMPAIGN_OWNER' ? 1 
                     : primaryRole === 'INFLUENCER' ? 2 
                     : null;

        // Build user object
        const userData = {
          userId,
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          roles: parsedRoles,
          role: primaryRole,
          roleId,
          needsRoleSelection
        };

        // Store auth data in Zustand
        setAuth(userData, accessToken);

        setStatus('success');
        toast.success('Successfully signed in with Google!', {
          position: 'top-right',
          autoClose: 3000,
        });

        // Navigate based on role selection needs
        setTimeout(() => {
          if (needsRoleSelection) {
            navigate('/role-selection', { 
              state: { userEmail: email } 
            });
          } else if (primaryRole) {
            // Navigate to appropriate dashboard
            if (primaryRole === 'ADMIN' || roleId === 3) {
              navigate('/dashboard/admin');
            } else if (primaryRole === 'CAMPAIGN_OWNER' || roleId === 1) {
              navigate('/dashboard/owner');
            } else if (primaryRole === 'INFLUENCER' || roleId === 2) {
              navigate('/dashboard/influencer');
            } else {
              navigate('/dashboard/influencer'); // Default fallback
            }
          } else {
            // No role assigned, go to role selection
            navigate('/role-selection', { 
              state: { userEmail: email } 
            });
          }
        }, 1500);

      } catch (error) {
        console.error('Error processing Google callback:', error);
        setStatus('error');
        setErrorMessage('Failed to process authentication');
        toast.error('Authentication processing failed', {
          position: 'top-right',
          autoClose: 5000,
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuth, updateUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#05060F] to-[#1e1632] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-[#745CB4]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#C1B6FD]/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.7,
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 shadow-2xl max-w-md w-full z-10 text-center"
      >
        {status === 'processing' && (
          <div className="space-y-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <Loader2 className="w-16 h-16 text-[#C1B6FD]" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Authenticating...
              </h2>
              <p className="text-gray-400">
                Please wait while we complete your Google sign-in
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="space-y-6"
          >
            <div className="inline-block">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Success!
              </h2>
              <p className="text-gray-400">
                Redirecting you to your dashboard...
              </p>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="space-y-6"
          >
            <div className="inline-block">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-400 mb-4">
                {errorMessage || 'Something went wrong during authentication'}
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
