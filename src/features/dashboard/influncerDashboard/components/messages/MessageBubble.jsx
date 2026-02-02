import { motion } from 'framer-motion';
import { Check, CheckCheck, FileText, Download } from 'lucide-react';

export default function MessageBubble({ message, isMe, avatarColor, avatar }) {
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      {!isMe && (
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-lg mr-2 self-end mb-1 shrink-0`}>
          {avatar}
        </div>
      )}
      
      <div className={`flex flex-col max-w-[75%] md:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
        <div
          className={`
            relative p-3.5 text-sm shadow-sm
            ${isMe 
              ? 'bg-gradient-to-br from-[#745CB4] to-[#C1B6FD] text-white rounded-2xl rounded-tr-none' 
              : 'bg-[#25252A] text-gray-100 rounded-2xl rounded-tl-none border border-white/5'
            }
          `}
        >
          {message.text}
          
          {/* Mock File Attachment */}
          {message.attachment && (
            <div className={`mt-3 flex items-center gap-3 p-2.5 rounded-xl ${isMe ? 'bg-black/20' : 'bg-[#1A1A1E]'}`}>
              <div className="p-2 bg-white/10 rounded-lg">
                <FileText className="w-5 h-5 text-current" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{message.attachment.name}</p>
                <p className="text-[10px] opacity-70">{message.attachment.size}</p>
              </div>
              <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-1 px-1">
          <span className="text-[10px] text-gray-500 font-medium">{message.timestamp}</span>
          {isMe && (
            <span className={message.status === 'read' ? 'text-[#C1B6FD]' : 'text-gray-500'}>
               {message.status === 'read' ? <CheckCheck className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
