import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Login from './Login';
import Register from './Register';

export default function AuthForm() {
  const location = useLocation();
  
  const isSignupPath = location.pathname === '/signup';
  const [isLogin, setIsLogin] = useState(!isSignupPath);

  useEffect(() => {
    const shouldBeLogin = location.pathname !== '/signup';
    setIsLogin(shouldBeLogin);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#05060F] to-[#1e1632] flex items-center justify-center p-4 relative overflow-hidden">
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
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#5D459D]/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl w-full max-w-lg z-10"
      >
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-1.5">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg shadow-[#C1B6FD]/30'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white shadow-lg shadow-[#C1B6FD]/30'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Sign up
            </button>
          </div>
        </div>

        {isLogin ? (
          <Login onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <Register onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </motion.div>
    </div>
  );
}