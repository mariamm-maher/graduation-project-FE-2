import { useState } from 'react';

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
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8 text-white">Sign in</h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#C1B6FD]/50 focus:ring-2 focus:ring-[#C1B6FD]/20 transition-all"
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white font-medium py-3 rounded-lg hover:shadow-lg hover:shadow-[#C1B6FD]/50 hover:scale-[1.02] transition-all duration-300 mt-2"
        >
          Sign in
        </button>
      </form>

      <div className="my-6 text-center text-gray-500 text-sm">OR SIGN IN WITH</div>

      <button className="w-full flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg py-3 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
        Google
      </button>

      <p className="text-center mt-8 text-gray-400">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-[#C1B6FD] underline hover:text-[#745CB4] transition-colors"
        >
          Create one
        </button>
      </p>
    </div>
  );
}