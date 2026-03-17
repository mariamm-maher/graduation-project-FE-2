import { motion } from 'framer-motion'
import { Users, TrendingUp, CheckCircle2, Clock, DollarSign, Target, Star, AlertCircle } from 'lucide-react'

const kanbanColumns = [
  {
    id: 1,
    title: 'Pending Review',
    count: 4,
    cards: [
      {
        tag: 'Fashion',
        title: 'Summer Collection Launch',
        priority: 'high',
        meta: { budget: '$8,500', reach: '2.5M' },
        progress: 35
      },
      {
        tag: 'Tech',
        title: 'Product Demo Video Series',
        meta: { budget: '$12,000', followers: '500K' },
        progress: 20
      }
    ]
  },
  {
    id: 2,
    title: 'Active Campaigns',
    count: 6,
    cards: [
      {
        tag: 'Beauty',
        title: 'Skincare Brand Partnership',
        meta: { budget: '$15,000', reach: '3.2M' },
        progress: 65
      },
      {
        tag: 'Fitness',
        title: 'Wellness Challenge Campaign',
        status: 'On Track',
        meta: { budget: '$6,500', followers: '800K' },
        progress: 80
      }
    ]
  },
  {
    id: 3,
    title: 'Completed',
    count: 8,
    cards: [
      {
        tag: 'Food',
        title: 'Restaurant Grand Opening',
        meta: { revenue: '$25,000', reach: '1.8M' },
        progress: 100
      },
      {
        tag: 'Travel',
        title: 'Destination Marketing',
        meta: { revenue: '$18,500', followers: '1.2M' },
        progress: 100
      }
    ]
  }
]

const CollaborationBoard = () => {
  return (
    <section id="collaboration" className="py-20 bg-gradient-to-b from-[#05060e] to-[#1e1632] relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(116,92,180,0.6) 0%, transparent 70%)',
            bottom: '5%',
            left: '15%',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-b from-[#745CB4]/10 to-[#C1B6FD]/10 border border-[#745CB4]/30 mb-6"
          >
            <Users className="w-5 h-5 text-[#745CB4]" />
            <span className="text-[#745CB4] font-semibold">Collaboration Hub</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400 mb-4 drop-shadow-[0_2px_30px_rgba(116,92,180,0.5)]">
            Influencer Collaboration Board
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
            Seamlessly manage partnerships, contracts, and campaigns
          </p>
        </motion.div>

        {/* Kanban Board (stack on mobile, 3 columns on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-6">
          {kanbanColumns.map((column, index) => (
            <KanbanColumn key={column.id} column={column} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const KanbanColumn = ({ column, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="h-full flex flex-col backdrop-blur-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-5 space-y-4 hover:border-[#745CB4]/40 hover:bg-white/[0.06] transition-all duration-500 shadow-2xl hover:shadow-[0_8px_30px_rgba(116,92,180,0.15)]"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#745CB4]/30 to-[#C1B6FD]/10 border border-[#745CB4]/30 flex items-center justify-center shadow-[0_0_15px_rgba(116,92,180,0.3)]">
            {column.title.includes('Pending') && <Clock className="w-4 h-4 text-[#C1B6FD]" />}
            {column.title.includes('Active') && <TrendingUp className="w-4 h-4 text-[#C1B6FD]" />}
            {column.title.includes('Completed') && <CheckCircle2 className="w-4 h-4 text-[#C1B6FD]" />}
          </div>
          <h4 className="font-bold text-white text-lg tracking-wide">{column.title}</h4>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#745CB4]/20 border border-[#745CB4]/30 text-[#C1B6FD] text-xs font-bold shadow-inner">
          {column.count}
        </span>
      </div>

      {column.cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + i * 0.1 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="group relative bg-[#1e1e1e] rounded-xl p-5 border border-white/5 hover:border-[#745CB4]/50 transition-all duration-300 cursor-pointer min-h-[11rem] flex flex-col shadow-lg hover:shadow-[0_10px_30px_rgba(116,92,180,0.2)] overflow-hidden"
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#745CB4]/5 via-transparent to-[#C1B6FD]/5" />
          
          <div className="relative z-10 flex flex-col h-full">
            {/* Header with tags */}
            <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide bg-[#745CB4]/10 text-[#C1B6FD] border border-[#745CB4]/20">
                <Target className="w-3.5 h-3.5" />
                {card.tag}
              </span>
              {card.priority && (
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  card.priority === 'high' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  <AlertCircle className="w-3 h-3" />
                  {card.priority === 'high' ? 'High Priority' : 'Medium'}
                </span>
              )}
              {card.status && (
                <span className="inline-flex items-center gap-1 text-green-400 text-xs font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  {card.status}
                </span>
              )}
            </div>

            {/* Title */}
            <h5 className="text-base font-bold text-white mb-3 group-hover:text-[#C1B6FD] transition-colors duration-300 line-clamp-2">
              {card.title}
            </h5>

            {/* Meta info with icons */}
            <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400 mb-5 mt-auto">
              {Object.entries(card.meta).map(([key, value], i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                  {key.includes('budget') || key.includes('revenue') ? (
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  ) : key.includes('reach') || key.includes('followers') ? (
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                  ) : (
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  {value}
                </span>
              ))}
            </div>

            {/* Progress bar */}
            {card.progress && (
              <div className="mt-auto pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs font-medium text-gray-400 mb-2.5">
                  <span>Progress</span>
                  <span className="font-bold text-[#C1B6FD]">{card.progress}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-full relative"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${card.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 1.2, ease: 'backOut' }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default CollaborationBoard

