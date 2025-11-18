import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react';
import logoGif from '../assets/Create an animated logo for a modern AI-powered social media marketing platform called AdSphere. The logo should feature a sleek 3D glowing sphere representing a connected digital ecosystem, with .gif';

// Generate particles outside component to avoid impure function calls during render
const generateParticles = () => 
  [...Array(20)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 10,
  }));

const particles = generateParticles();

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="bg-linear-to-b from-[#000000] via-[#05060F] to-[#1e1632] min-h-screen text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#745CB4]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#C1B6FD]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#5D459D]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Animated Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img 
              src={logoGif} 
              alt="AdSphere Logo" 
              className="w-48 h-48 object-contain"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#C1B6FD]/20 to-transparent rounded-full blur-xl"></div>
          </div>
        </div>


        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="group bg-linear-to-r from-[#745CB4] to-[#C1B6FD] text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 hover:shadow-2xl hover:shadow-[#C1B6FD]/50 transition-all duration-300 hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate('/about')}
            className="bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
          >
            Learn More
          </button>
        </div>

        {/* Footer Text */}
        <p className="mt-16 text-sm text-gray-500">
          Join thousands of marketers revolutionizing their social media strategy
        </p>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-[#C1B6FD] rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Welcome;