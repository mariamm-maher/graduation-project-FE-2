import { X, Send, Paperclip, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

function ChatPanel({ selectedCollab, chatMessage, setChatMessage, onClose, onSendMessage }) {
  return (
    <motion.aside
      key="chat"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden h-fit lg:sticky lg:top-6 order-1 lg:order-2"
    >
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">Messages</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          {selectedCollab.influencerImage ? (
            <img 
              src={selectedCollab.influencerImage} 
              alt={selectedCollab.influencerName}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#C1B6FD] to-[#745CB4] flex items-center justify-center font-bold text-white text-sm">
              {selectedCollab.influencerAvatar}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm truncate">{selectedCollab.influencerName}</p>
            <p className="text-xs text-gray-400 truncate">{selectedCollab.campaignName}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="p-4 h-[400px] overflow-y-auto space-y-4">
        {/* Sample messages */}
        <div className="flex gap-3">
          <img 
            src={selectedCollab.influencerImage} 
            alt={selectedCollab.influencerName}
            className="w-8 h-8 rounded-lg object-cover shrink-0"
          />
          <div className="bg-white/10 rounded-xl rounded-tl-sm p-3 max-w-[80%]">
            <p className="text-sm text-white">Hey! I've completed the photoshoot and the content looks amazing. Want to review before I post?</p>
            <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <div className="bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl rounded-tr-sm p-3 max-w-[80%]">
            <p className="text-sm text-white">That's great! Yes, please share the preview. Looking forward to seeing it! 🎉</p>
            <p className="text-xs text-white/70 mt-1">10:32 AM</p>
          </div>
        </div>

        <div className="flex gap-3">
          <img 
            src={selectedCollab.influencerImage} 
            alt={selectedCollab.influencerName}
            className="w-8 h-8 rounded-lg object-cover shrink-0"
          />
          <div className="bg-white/10 rounded-xl rounded-tl-sm p-3 max-w-[80%]">
            <p className="text-sm text-white">Here's the link to the preview gallery. Let me know if you need any changes!</p>
            <p className="text-xs text-gray-500 mt-1">10:35 AM</p>
          </div>
        </div>

        <div className="text-center">
          <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">Today</span>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message..."
              rows="2"
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 pr-20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C1B6FD] resize-none text-sm"
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button className="p-1.5 hover:bg-white/10 rounded-lg transition-all">
                <Paperclip className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded-lg transition-all">
                <Smile className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <button
            onClick={onSendMessage}
            disabled={!chatMessage.trim()}
            className="p-3 bg-linear-to-r from-[#745CB4] to-[#C1B6FD] rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

export default ChatPanel;
