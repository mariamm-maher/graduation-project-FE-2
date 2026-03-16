import { Phone, Video, MoreVertical, ChevronLeft, Briefcase, FileText, Calendar, Clock, Star } from 'lucide-react';

export default function ChatHeader({ conversation, onBack, onOpenDetails }) {
  if (!conversation) return null;

  return (
    <div className="h-[72px] px-4 md:px-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-xl z-10 sticky top-0">
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="md:hidden p-2 -ml-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="relative cursor-pointer" onClick={onOpenDetails}>
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${conversation.avatarColor} flex items-center justify-center text-white font-bold text-xs shadow-lg ring-2 ring-white/5`}>
            {conversation.avatar}
          </div>
          {conversation.online && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black" />
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base tracking-tight">{conversation.name}</h3>
            {/* Status Badge */}
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
              Active
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1 text-[#C1B6FD] font-medium">
              <Briefcase className="w-3 h-3" />
              {conversation.campaign}
            </span>
            {conversation.active && (
              <span className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                Online
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 md:gap-2">
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-xs font-medium border border-white/5">
          <FileText className="w-3.5 h-3.5" />
          Contract
        </button>
        <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />
        
        <button className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-[#C1B6FD] transition-colors">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-[#C1B6FD] transition-colors">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
