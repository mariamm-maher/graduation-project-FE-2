import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Sparkles, FolderKanban, BarChart3, Users, MessageSquare, FileSignature } from 'lucide-react'
import aiGenerationImg from '../../../assets/01.png'
import campaignManagementImg from '../../../assets/02.jpg'
import influencerCollabImg from '../../../assets/04.jpg'
import communicationHubImg from '../../../assets/03.jpg'

const iconMap = {
  sparkles: Sparkles,
  'folder-kanban': FolderKanban,
  'bar-chart-3': BarChart3,
  users: Users,
  'message-square': MessageSquare,
  'file-signature': FileSignature,
}

const features = [
  {
    id: 1,
    icon: 'sparkles',
    title: 'AI-Powered Campaign Generation',
    description: 'Generate complete marketing campaigns in seconds with AI-driven strategy, content calendar, and budget recommendations.',
    image: aiGenerationImg,
    objectFit: 'object-contain',
    features: [
      'AI-generated campaign strategy and goals',
      'Smart content calendar with posting schedule',
      'Automated budget allocation across platforms',
      'Platform recommendations based on target audience'
    ]
  },
  {
    id: 2,
    icon: 'folder-kanban',
    title: 'Campaign Lifecycle Management',
    description: 'Create, plan, and manage campaigns from draft to completion with structured workflows and milestone tracking.',
    image: campaignManagementImg,
    objectFit: 'object-contain',
    features: [
      'Campaign creation with goals, budget, and duration',
      'Draft, publish, complete, and cancel workflows',
      'Target audience and KPI configuration',
      'Campaign status tracking and analytics'
    ]
  },
  {
    id: 3,
    icon: 'users',
    title: 'Influencer Discovery & Collaboration',
    description: 'Find and work with influencers through a complete collaboration workflow from invitation to project completion.',
    image: influencerCollabImg,
    features: [
      'Browse and discover influencer profiles',
      'Send collaboration requests with negotiation',
      'Contract creation and digital signing',
      'Task assignment and deliverable tracking'
    ]
  },
  {
    id: 4,
    icon: 'message-square',
    title: 'Real-Time Communication Hub',
    description: 'Stay connected with built-in messaging, notifications, and collaboration tools for seamless teamwork.',
    image: communicationHubImg,
    features: [
      'Real-time chat between owners and influencers',
      'Instant notifications for updates and actions',
      'Collaboration request management',
      'In-app messaging with conversation history'
    ]
  }
]

const Features = () => {
  return (
    <section id="features" className="relative bg-gradient-to-b from-[#1e1632] to-[#05060e] overflow-hidden">
     

      {/* Parallax Scenes (First 2) */}
      {features.slice(0, 2).map((feature, index) => (
        <ParallaxScene key={feature.id} feature={feature} index={index} />
      ))}

      {/* Scrollytelling Scenes (Last 2) */}
      <ScrollytellingScenes features={features.slice(2, 4)} />

      {/* Background Decoration */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#745CB4]/5 rounded-full blur-[150px] pointer-events-none" />
    </section>
  )
}

// Parallax Scene Component (for first 2 features)
const ParallaxScene = ({ feature, index }) => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const Icon = iconMap[feature.icon]
  
  // Parallax transforms
  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8])
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  const isEven = index % 2 === 0
//from 1e1632
//to #05060e
  return (
    <div 
      ref={containerRef}
      className="relative    min-h-[70vh] flex items-center justify-center py-20 px-6 "
    >
      <div className="max-w-[1400px] mx-auto w-full">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
          {/* Image Side */}
          <motion.div
            style={{ y: imageY, scale: imageScale, opacity }}
            className={`relative max-w-[520px] ${!isEven ? 'lg:col-start-2' : ''}`}
          >
              <div className={`group relative ${feature.objectFit ? 'aspect-square' : 'aspect-4/3'} rounded-3xl overflow-hidden backdrop-blur-md border border-white/10 transition-all duration-500 hover:border-[#745CB4]/50 hover:shadow-[0_0_40px_rgba(116,92,180,0.35)] ${feature.objectFit ? 'bg-[#16102e]' : 'bg-white/5'}`}>
              {/* Feature image */}
              <img src={feature.image} alt={feature.title} loading="lazy" className={`absolute inset-0 w-full h-full ${feature.objectFit ?? 'object-cover'} z-10 transition-transform duration-700 group-hover:scale-105`} />
              
              {/* Glow overlay — skip for illustration images */}
              {!feature.objectFit && <div className="absolute inset-0 bg-gradient-to-b from-[#252525]/80 via-transparent to-transparent z-20" />}
              {/* Subtle inner glow for illustrations */}
              {feature.objectFit && <div className="absolute inset-0 bg-gradient-to-t from-[#16102e]/60 via-transparent to-transparent z-20 pointer-events-none" />}
            </div>

            {/* Floating icon badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl bg-gradient-to-b from-[#745CB4] to-[#5D459D] flex items-center justify-center shadow-[0_0_40px_rgba(116,92,180,0.5)]"
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            style={{ y: textY, opacity }}
            className={`space-y-6 ${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}
          >
            <motion.div
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Number badge */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#745CB4]/10 border border-[#745CB4]/30">
                <span className="text-xl font-bold text-[#745CB4]">0{index + 1}</span>
              </div>

              {/* Title */}
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
                {feature.description}
              </p>

              {/* Feature List */}
              <ul className="space-y-3 pt-3">
                {feature.features.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4 text-gray-300"
                  >
                    <span className="mt-2 w-2 h-2 rounded-full bg-gradient-to-b from-[#745CB4] to-[#C1B6FD] shrink-0" />
                    <span className="text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Fade-In Scene Component (for last 2 features)
const ScrollytellingScenes = ({ features }) => {
  return (
    <div className="relative">
      {features.map((feature, index) => {
        const Icon = iconMap[feature.icon]
        const isEven = index % 2 === 0

        return (
          <div 
            key={feature.id}
            className="relative min-h-[70vh] flex items-center justify-center py-20 px-6"
          >
            <div className="max-w-[1400px] mx-auto w-full">
              <div className={`grid lg:grid-cols-2 gap-16 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
                {/* Image Side */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                    className={`relative max-w-[520px] ${!isEven ? 'lg:col-start-2' : ''}`}
                  >
                    <div className={`group relative ${feature.objectFit ? 'aspect-square' : 'aspect-4/3'} rounded-3xl overflow-hidden backdrop-blur-md border border-white/10 transition-all duration-500 hover:border-[#745CB4]/50 hover:shadow-[0_0_40px_rgba(116,92,180,0.35)] ${feature.objectFit ? 'bg-[#16102e]' : 'bg-white/5'}`}>
                    {/* Feature image */}
                    <img src={feature.image} alt={feature.title} loading="lazy" className={`absolute inset-0 w-full h-full ${feature.objectFit ?? 'object-cover'} z-10 transition-transform duration-700 group-hover:scale-105`} />
                    
                    {/* Glow overlay — skip for illustration images */}
                    {!feature.objectFit && <div className="absolute inset-0 bg-gradient-to-b from-[#252525]/80 via-transparent to-transparent z-20" />}
                    {/* Subtle inner glow for illustrations */}
                    {feature.objectFit && <div className="absolute inset-0 bg-gradient-to-t from-[#16102e]/60 via-transparent to-transparent z-20 pointer-events-none" />}
                  </div>

                  {/* Floating icon badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl bg-gradient-to-b from-[#745CB4] to-[#5D459D] flex items-center justify-center shadow-[0_0_40px_rgba(116,92,180,0.5)] z-30"
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>
                </motion.div>

                {/* Content Side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8 }}
                  className={`space-y-8 ${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}
                >
                  <div className="space-y-6">
                    {/* Number badge */}
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#745CB4]/10 border border-[#745CB4]/30">
                      <span className="text-xl font-bold text-[#745CB4]">0{index + 3}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
                      {feature.description}
                    </p>

                    {/* Feature List */}
                    <ul className="space-y-3 pt-3">
                      {feature.features && feature.features.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                          className="flex items-start gap-4 text-gray-300"
                        >
                          <span className="mt-2 w-2 h-2 rounded-full bg-gradient-to-b from-[#745CB4] to-[#C1B6FD] shrink-0" />
                          <span className="text-lg">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Features

