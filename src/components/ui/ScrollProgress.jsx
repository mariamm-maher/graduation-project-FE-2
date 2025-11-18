import { motion, useScroll, useSpring } from 'framer-motion'

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-[#745CB4] via-[#5D459D] to-[#C1B6FD] transform-origin-left z-50 shadow-[0_0_10px_rgba(116,92,180,0.5)]"
      style={{ scaleX }}
    />
  )
}

export default ScrollProgress
