import { motion } from 'framer-motion'
import { Bell, MessageSquare, Shield, Zap, User, Building2, Send, Paperclip, Users } from 'lucide-react'

const iconMap = {
  '🔔': Bell,
  '💬': MessageSquare,
  '🛡️': Shield,
  '⚡': Zap,
}

const commFeatures = [
  {
    icon: '🔔',
    title: 'Smart Notifications',
    description: 'Get alerted on campaign milestones, influencer responses, and important updates'
  },
  {
    icon: '💬',
    title: 'Role-Based Chat',
    description: 'Separate channels for agencies, brands, and influencers with context-aware messaging'
  },
  {
    icon: '🛡️',
    title: 'Secure Messaging',
    description: 'End-to-end encryption ensures your conversations and contracts stay private'
  },
  {
    icon: '⚡',
    title: 'Instant Updates',
    description: 'Real-time sync across devices so you never miss a beat'
  }
]

const CommunicationSystem = () => {
  return (
    <section id="communication" className="py-20 bg-gradient-to-b from-[#1e1632] via-[#05060F] to-[#000000] relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-52 h-52 rounded-full blur-[100px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(116,92,180,0.4) 0%, transparent 70%)',
            top: '20%',
            left: '5%',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-b from-[#745CB4]/10 to-[#C1B6FD]/10 border border-[#745CB4]/30 mb-3"
            >
              <MessageSquare className="w-4 h-4 text-[#745CB4]" />
              <span className="text-[#745CB4] text-sm font-semibold">Real-Time Communication</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-[0_2px_30px_rgba(116,92,180,0.5)]">
              Instant Notifications & Smart Chat
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed">
              Never miss an important update. Our intelligent notification system keeps you
              informed while our role-based chat enables seamless communication.
            </p>

            <div className="grid md:grid-cols-2 gap-2">
              {commFeatures.map((feature, index) => {
                const Icon = iconMap[feature.icon] || MessageSquare
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="group p-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl hover:border-[#745CB4]/30 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-[#745CB4]/20 to-[#C1B6FD]/20 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 text-[#745CB4]" />
                    </div>
                    <h4 className="font-bold text-sm text-white mb-1.5 group-hover:text-[#745CB4] transition-colors duration-300">{feature.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{feature.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Chat Mockup */}
          <ChatMockup />
        </div>
      </div>
    </section>
  )
}

const ChatMockup = () => {
  const budgetConversation = [
    {
      id: 1,
      type: 'received',
      sender: 'Sarah (Influencer)',
      text: "Hi! I'm interested in your campaign. What budget range are you working with?",
      time: '10:23 AM',
      icon: User
    },
    {
      id: 2,
      type: 'sent',
      sender: 'Agency Owner',
      text: "Hello Sarah! We're looking at $5,000-$8,000 for this campaign. Does that work for you?",
      time: '10:25 AM',
      icon: Building2
    },
    {
      id: 3,
      type: 'received',
      sender: 'Sarah (Influencer)',
      text: "That's in my range! Can we discuss deliverables? I'm thinking 3 posts + 5 stories.",
      time: '10:27 AM',
      icon: User
    },
    // {
    //   id: 4,
    //   type: 'sent',
    //   sender: 'Agency Owner',
    //   text: "Perfect! Let's go with $6,500 for that package. I'll send over the contract details.",
    //   time: '10:29 AM',
    //   icon: Building2
    // },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden max-w-sm mx-auto shadow-2xl"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#745CB4]/20 bg-gradient-to-b from-[#745CB4]/10 to-[#C1B6FD]/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#745CB4]/30 to-[#C1B6FD]/30 flex items-center justify-center border border-[#745CB4]/30">
                <Users className="w-5 h-5 text-[#745CB4]" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div>
              <h5 className="font-bold text-sm text-white">Campaign Discussion</h5>
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Both online
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="text-gray-400 hover:text-[#745CB4] transition-colors">
              <Bell className="w-4 h-4" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="text-gray-400 hover:text-[#745CB4] transition-colors">
              <Paperclip className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-4 min-h-[360px] bg-gradient-to-b from-gray-900/50 to-black/50">
        {budgetConversation.map((message, index) => {
          const Icon = message.icon
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'} gap-2`}
            >
              {message.type === 'received' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#C1B6FD]/30 to-[#745CB4]/30 flex items-center justify-center shrink-0 border border-[#C1B6FD]/30">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
              )}
              <div className={`max-w-[70%] ${message.type === 'sent' ? 'text-right' : ''}`}>
                <div className="text-[11px] font-medium text-gray-400 mb-1">{message.sender}</div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-2xl ${
                    message.type === 'sent'
                      ? 'bg-gradient-to-b from-[#745CB4] to-[#5D459D] text-white shadow-[0_0_20px_rgba(116,92,180,0.3)]'
                      : 'bg-gradient-to-b from-gray-800/80 to-gray-900/80 text-gray-100 border border-white/5'
                  }`}
                >
                  <p className="text-xs leading-relaxed">{message.text}</p>
                </motion.div>
                <div className="text-[11px] text-gray-500 mt-1">{message.time}</div>
              </div>
              {message.type === 'sent' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#745CB4]/30 to-[#C1B6FD]/30 flex items-center justify-center shrink-0 border border-[#745CB4]/30">
                  <Icon className="w-4 h-4 text-[#745CB4]" />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/5 bg-gray-900/50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-3 py-2.5 rounded-xl bg-gray-800/50 border border-white/5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#745CB4]/50 transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2.5 rounded-xl bg-gradient-to-b from-[#745CB4] to-[#5D459D] text-white shadow-[0_0_20px_rgba(116,92,180,0.3)]"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default CommunicationSystem

