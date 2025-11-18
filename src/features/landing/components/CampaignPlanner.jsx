import { motion } from 'framer-motion'
import { Sparkles, Target, TrendingUp, Palette, Zap } from 'lucide-react'

const iconMap = {
  '🎯': Target,
  '📈': TrendingUp,
  '🎨': Palette,
  '⚡': Zap,
}

const plannerFeatures = [
  {
    icon: '🎯',
    title: 'Goal-Driven Planning',
    description: 'AI sets objectives and KPIs automatically based on your business goals'
  },
  {
    icon: '📈',
    title: 'Trend Analysis',
    description: 'Leverage real-time trend data to maximize engagement and reach'
  },
  {
    icon: '🎨',
    title: 'Creative Automation',
    description: 'Generate stunning visuals and copy that align with your brand'
  },

]

const CampaignPlanner = () => {
  return (
    <section id="campaign-planner" className="py-24 bg-[#1a1a1a] relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-[120px] opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(116,92,180,0.4) 0%, transparent 70%)',
            top: '20%',
            left: '10%',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-[120px] opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(193,182,253,0.35) 0%, transparent 70%)',
            bottom: '10%',
            right: '10%',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Decorative Waves */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none opacity-30 z-10">
        <svg viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-32">
          <motion.path
            d="M0,100 Q300,50 600,100 T1200,100 L1200,0 L0,0 Z"
            fill="rgba(116,92,180,0.25)"
            animate={{
              d: [
                'M0,100 Q300,50 600,100 T1200,100 L1200,0 L0,0 Z',
                'M0,80 Q300,120 600,80 T1200,80 L1200,0 L0,0 Z',
                'M0,100 Q300,50 600,100 T1200,100 L1200,0 L0,0 Z',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <PlannerGraphic />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 space-y-8"
          >
           

            <h2 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-[0_2px_20px_rgba(116,92,180,0.4)]">
              AI Campaigns in <span className="text-transparent bg-clip-text bg-linear-to-r from-[#745CB4] to-[#C1B6FD]">Seconds</span>
            </h2>

            <p className="text-lg text-gray-400 leading-relaxed">
              Smart AI builds complete campaign strategies instantly—content calendars, 
              posting schedules, and budget plans tailored to your goals.
            </p>

            <div className="space-y-4">
              {plannerFeatures.map((feature, index) => {
                const Icon = iconMap[feature.icon]
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ x: 8, transition: { duration: 0.3 } }}
                    className="flex gap-4 p-5 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-[#745CB4]/5 transition-all duration-300 group"
                  >
                    <motion.div
                      className="shrink-0 w-12 h-12 rounded-lg bg-linear-to-r from-[#745CB4] to-[#5D459D] flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-[#745CB4] transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl bg-linear-to-r from-[#745CB4] to-[#5D459D] text-white font-semibold shadow-[0_4px_16px_rgba(116,92,180,0.5)] hover:shadow-[0_8px_28px_rgba(116,92,180,0.7)] transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Generate Campaign Plan
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const PlannerGraphic = () => {
  return (
    <div className="relative">
      <motion.svg
        viewBox="0 0 400 500"
        className="w-full h-auto max-w-md mx-auto text-[#745CB4] drop-shadow-[0_0_30px_rgba(116,92,180,0.3)]"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Document Outline */}
        <motion.rect
          x="80"
          y="50"
          width="240"
          height="340"
          rx="8"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />

        {/* Title Lines */}
        <motion.line
          x1="100"
          y1="80"
          x2="200"
          y2="80"
          stroke="currentColor"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        <motion.line
          x1="100"
          y1="100"
          x2="280"
          y2="100"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />

        {/* Content Blocks */}
        {[130, 185, 240].map((y, i) => (
          <motion.rect
            key={i}
            x="100"
            y={y}
            width="180"
            height="40"
            rx="4"
            fill="currentColor"
            opacity="0.1"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 + i * 0.2, duration: 0.5 }}
          />
        ))}

        {/* Checkmarks */}
        {[150, 205, 260].map((y, i) => (
          <motion.path
            key={i}
            d={`M105 ${y} L115 ${y + 10} L130 ${y - 10}`}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 + i * 0.2, duration: 0.5 }}
          />
        ))}

        {/* AI Brain */}
        <motion.circle
          cx="200"
          cy="330"
          r="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* AI Dots */}
        {[[190, 320], [200, 315], [210, 320], [200, 330]].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="4"
            fill="currentColor"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
          />
        ))}
      </motion.svg>
    </div>
  )
}

export default CampaignPlanner
