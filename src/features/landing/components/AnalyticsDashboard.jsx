import { motion } from 'framer-motion'

const dashboardCards = [
  {
    id: 1,
    title: 'Total Reach',
    value: '12.4M',
    type: 'line',
    trend: '+18% from last month'
  },
  {
    id: 2,
    title: 'Engagement Rate',
    value: '8.7%',
    type: 'bar',
    trend: '+2.3% increase'
  },
  {
    id: 3,
    title: 'Active Campaigns',
    value: '24',
    type: 'bubble',
    trend: '6 launching soon'
  },
  {
    id: 4,
    title: 'Platform Performance',
    type: 'bars',
    bars: [
      { label: 'Instagram', value: 85 },
      { label: 'TikTok', value: 72 },
      { label: 'YouTube', value: 68 }
    ]
  },
  {
    id: 5,
    title: 'ROI',
    value: '342%',
    type: 'gauge',
    trend: 'Above industry average'
  },
  {
    id: 6,
    title: 'Influencer Score',
    value: '9.2/10',
    type: 'line',
    trend: 'Excellent performance'
  }
]

// Pre-generate random values for particles
const particles = [...Array(15)].map(() => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: 3 + Math.random() * 4,
  delay: Math.random() * 5,
}))

const AnalyticsDashboard = () => {
  return (
    <section id="analytics" className="py-32 bg-linear-to-b from-[#252525] via-[#1a1a1a] to-black relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)',
            top: '20%',
            left: '10%',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(196,181,253,0.35) 0%, transparent 70%)',
            top: '50%',
            right: '15%',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.35, 0.15],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full blur-[90px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
            bottom: '10%',
            left: '50%',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.3, 0.2],
            x: [-30, 30, -30],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-400/10 to-purple-300/10 border border-purple-400/30 mb-6"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-300"></span>
            </span>
            <span className="text-purple-300 font-semibold">Real-Time Analytics</span>
          </motion.div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-[0_2px_30px_rgba(167,139,250,0.5)]">
            Powerful Analytics Dashboard
          </h2>
          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto">
            Track every metric that matters to your business
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <DashboardCard key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const DashboardCard = ({ card, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl space-y-4 hover:border-purple-400/40 hover:bg-white/8 transition-all duration-300 overflow-hidden"
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(167,139,250,0.05) 0%, rgba(196,181,253,0.05) 100%)',
        }}
      />
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-1 bg-linear-to-r from-purple-400/20 via-purple-300/20 to-indigo-400/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
      />

      <div className="relative z-10 flex justify-between items-start">
        <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">{card.title}</h4>
        <span className="text-2xl font-bold text-purple-300">{card.value}</span>
      </div>

      {card.type === 'line' && <LineChart />}
      {card.type === 'bar' && <BarChart />}
      {card.type === 'bubble' && <BubbleChart />}
      {card.type === 'bars' && <HorizontalBars bars={card.bars} />}
      {card.type === 'gauge' && <GaugeChart />}

      {card.trend && (
        <div className="relative z-10">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            {card.trend}
          </p>
        </div>
      )}
    </motion.div>
  )
}

const LineChart = () => (
  <svg viewBox="0 0 200 80" className="w-full h-16 relative z-10">
    <motion.polyline
      points="10,60 40,40 70,50 100,20 130,30 160,10 190,15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-purple-400"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5 }}
    />
    {[10, 40, 100, 190].map((x, i) => (
      <circle key={i} cx={x} cy={[60, 40, 20, 15][i]} r="3" className="fill-purple-300" />
    ))}
  </svg>
)

const BarChart = () => (
  <svg viewBox="0 0 200 80" className="w-full h-16 relative z-10">
    {[10, 40, 70, 100, 130, 160].map((x, i) => {
      const heights = [30, 50, 60, 70, 55, 40]
      return (
        <motion.rect
          key={i}
          x={x}
          y={80 - heights[i]}
          width="20"
          height={heights[i]}
          className="fill-purple-400"
          initial={{ height: 0, y: 80 }}
          whileInView={{ height: heights[i], y: 80 - heights[i] }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        />
      )
    })}
  </svg>
)

const BubbleChart = () => (
  <svg viewBox="0 0 200 80" className="w-full h-16 relative z-10">
    {[[30, 50, 8], [60, 40, 10], [90, 30, 12], [120, 25, 14], [150, 35, 12], [180, 45, 10]].map(([cx, cy, r], i) => (
      <motion.circle
        key={i}
        cx={cx}
        cy={cy}
        r={r}
        className="fill-purple-400"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
      />
    ))}
  </svg>
)

const HorizontalBars = ({ bars }) => (
  <div className="space-y-3 relative z-10">
    {bars.map((bar, i) => (
      <div key={i}>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">{bar.label}</span>
          <span className="text-purple-300 font-semibold">{bar.value}%</span>
        </div>
        <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-purple-400 to-purple-300 shadow-[0_0_8px_rgba(167,139,250,0.5)]"
            initial={{ width: 0 }}
            whileInView={{ width: `${bar.value}%` }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 1 }}
          />
        </div>
      </div>
    ))}
  </div>
)

const GaugeChart = () => (
  <svg viewBox="0 0 180 100" className="w-full h-20 relative z-10">
    <path
      d="M 20 80 A 60 60 0 0 1 160 80"
      fill="none"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <motion.path
      d="M 20 80 A 60 60 0 0 1 140 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
      strokeLinecap="round"
      className="text-purple-400"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5 }}
    />
    <circle cx="90" cy="80" r="4" className="fill-purple-300" />
  </svg>
)

export default AnalyticsDashboard
