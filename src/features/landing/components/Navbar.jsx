import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import logoGif from '../../../assets/Create an animated logo for a modern AI-powered social media marketing platform called AdSphere. The logo should feature a sleek 3D glowing sphere representing a connected digital ecosystem, with .gif'

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(26, 26, 26, 0)', 'rgba(26, 26, 26, 0.95)']
  )
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(20px)']
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ]

  return (
    <motion.nav
      style={{ backgroundColor, backdropFilter: backdropBlur }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-2xl border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-lg shadow-purple-500/30"
              >
                <img 
                  src={logoGif} 
                  alt="AdSphere Logo" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-300 to-indigo-400 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-purple-200 to-indigo-300 bg-clip-text text-transparent">
              AdSphere
            </span>
          </motion.div>

       

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Join Us Dropdown */}
            <div className="relative group">
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 text-sm font-medium text-white bg-purple-500/10 border border-purple-400/20 rounded-lg hover:bg-purple-500/20 hover:border-purple-400/40 transition-all duration-200 backdrop-blur-sm flex items-center space-x-2"
              >
                <span>Join Us</span>
                <svg
                  className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              
              {/* Dropdown Menu */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
              >
                <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  <a
                    href="#join-influencer"
                    className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-400/10 transition-all duration-200 group/item"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-300 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">As Influencer</div>
                      <div className="text-xs text-gray-500">Monetize your influence</div>
                    </div>
                  </a>
                  <a
                    href="#join-agency"
                    className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-indigo-400/10 transition-all duration-200 group/item"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">As Agency Owner</div>
                      <div className="text-xs text-gray-500">Scale your business</div>
                    </div>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Create Campaign with AI */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-5 py-2.5 text-sm font-medium text-white rounded-lg overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <span className="relative flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Create Campaign with AI</span>
              </span>
            </motion.button>

            {/* Login Button */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 text-sm font-medium text-white border border-purple-400/30 rounded-lg hover:bg-purple-500/10 hover:border-purple-400/50 transition-all duration-200 backdrop-blur-sm"
            >
              Login
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-[#1a1a1a]/98 backdrop-blur-xl border-t border-white/5"
      >
        <div className="px-4 py-6 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          
          <div className="pt-3 space-y-3 border-t border-white/10">
            <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Join Us</div>
            <a
              href="#join-influencer"
              className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-400/10 rounded-lg transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-300 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span>As Influencer</span>
            </a>
            <a
              href="#join-agency"
              className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-indigo-400/10 rounded-lg transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span>As Agency Owner</span>
            </a>
          </div>

          <button className="w-full px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400 rounded-lg hover:shadow-lg hover:shadow-purple-400/50 transition-all duration-200">
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Create Campaign with AI</span>
            </span>
          </button>

          <button className="w-full px-5 py-3 text-sm font-medium text-white border border-purple-400/30 rounded-lg hover:bg-purple-500/10 hover:border-purple-400/50 transition-all duration-200">
            Login
          </button>
        </div>
      </motion.div>
    </motion.nav>
  )
}

export default Navbar
