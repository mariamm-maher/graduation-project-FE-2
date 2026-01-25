import { useState } from 'react';
import { Mail, Lock, ArrowRight, Chrome } from 'lucide-react';

export default function Login({ onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 animate-slideDown">Welcome Back</h2>
        <p className="text-gray-400 text-sm animate-slideDown" style={{ animationDelay: '0.1s' }}>Sign in to continue your journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="relative group animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#C1B6FD] transition-colors duration-300" />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full pl-11 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300 hover:bg-white/10"
            required
          />
        </div>

        <div className="relative group animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#C1B6FD] transition-colors duration-300" />
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full pl-11 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all duration-300 hover:bg-white/10"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white font-semibold py-3.5 rounded-lg hover:shadow-lg hover:shadow-[#C1B6FD]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-2 flex items-center justify-center gap-2 group animate-slideUp"
          style={{ animationDelay: '0.4s' }}
        >
          <span>Sign in</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </form>

      <div className="flex items-center gap-4 my-6 animate-slideUp" style={{ animationDelay: '0.5s' }}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <span className="text-gray-400 text-sm font-medium">OR</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      <button 
        type="button"
        className="w-full flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg py-3 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group animate-slideUp"
        style={{ animationDelay: '0.6s' }}
      >
        <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
        <span>Continue with Google</span>
      </button>

      <p className="text-center mt-8 text-gray-400 animate-slideUp" style={{ animationDelay: '0.7s' }}>
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-[#C1B6FD] font-semibold hover:text-[#745CB4] transition-colors duration-300 hover:underline"
        >
          Create one
        </button>
      </p>
    </div>
  );
}