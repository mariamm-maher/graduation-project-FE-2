import { motion } from 'framer-motion'
import {  BarChart3, Target, Smartphone, Zap } from 'lucide-react'
import gemini from '../../../assets/gemini.mp4'

const Hero = () => {


  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#1a1a1a] via-[#252525]/50 to-[#1a1a1a] pt-20">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-[100px] opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(116,92,180,0.45) 0%, transparent 70%)',
            top: '15%',
            left: '15%',
          }}
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
          className="absolute w-96 h-96 rounded-full blur-[100px] opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(93,69,157,0.4) 0%, transparent 70%)',
            top: '20%',
            right: '15%',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-12 items-center min-h-[90vh] py-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
         

            {/* Title */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight"
              >
                <span className="block text-white">Transform Your</span>
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#745CB4] via-[#5D459D] to-[#C1B6FD]">
                  Social Presence
                </span>
                <span className="block text-white">Into Real Results</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed"
              >
                 automate your social marketing. Focus on growing your brand.
              </motion.p>
            </div>

         
          </motion.div>

          {/* Right Content - Video */}
          <HeroMedia />
        </div>
      </div>

      {/* Decorative Waves */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-20">
        <svg viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-32">
          <motion.path
            d="M0,100 Q300,50 600,100 T1200,100 L1200,400 L0,400 Z"
            fill="rgba(116,92,180,0.1)"
            animate={{ d: [
              'M0,100 Q300,50 600,100 T1200,100 L1200,400 L0,400 Z',
              'M0,120 Q300,80 600,120 T1200,120 L1200,400 L0,400 Z',
              'M0,100 Q300,50 600,100 T1200,100 L1200,400 L0,400 Z',
            ]}}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </section>
  )
}

// Hero Media Component
const HeroMedia = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="relative"
    >
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Video Container */}
        <div className="relative rounded-4xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),0_30px_60px_rgba(116,92,180,0.25)]">
          <video
            src={gemini}
            className="w-full h-full object-cover aspect-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />

          {/* Glass Frame Overlay */}
          <div className="absolute inset-0 rounded-4xl border-2 border-[#745CB4]/40 pointer-events-none">
            <div className="absolute inset-0 bg-linear-to-br from-[#745CB4]/15 via-transparent to-[#C1B6FD]/12 rounded-4xl" />
          </div>
        </div>

        {/* Glow Ring */}
        <motion.div
          className="absolute -inset-5 rounded-[40px] blur-[35px] opacity-70 -z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(116,92,180,0.4), rgba(93,69,157,0.35), rgba(193,182,253,0.4))',
          }}
          animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating Elements */}
        <FloatingElement icon={<BarChart3 className="w-6 h-6" />} index={0} />
        <FloatingElement icon={<Target className="w-6 h-6" />} index={1} />
        <FloatingElement icon={<Smartphone className="w-6 h-6" />} index={2} />
        <FloatingElement icon={<Zap className="w-6 h-6" />} index={3} />
      </motion.div>
    </motion.div>
  )
}

// Floating Element Component
const FloatingElement = ({ icon, index }) => {
  const positions = [
    { top: '10%', left: '-10%' },
    { top: '20%', right: '-10%' },
    { bottom: '30%', left: '-10%' },
    { bottom: '20%', right: '-10%' },
  ]

  return (
    <motion.div
      className="absolute w-14 h-14 rounded-full backdrop-blur-md bg-white/5 border border-white/10 flex items-center justify-center text-[#745CB4] shadow-lg hover:shadow-[#745CB4]/50"
      style={positions[index]}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, 0, -10, 0],
      }}
      transition={{
        duration: 4 + index,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.5,
      }}
      whileHover={{ scale: 1.3, rotate: 360 }}
    >
      {icon}
    </motion.div>
  )
}

export default Hero
