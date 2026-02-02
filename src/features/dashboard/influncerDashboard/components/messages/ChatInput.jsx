import { Send, Smile, Paperclip, Mic, Image, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
    // Reset height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="p-4 bg-white/5 border-t border-white/10 relative z-20">
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl shadow-lg focus-within:ring-1 focus-within:ring-[#C1B6FD]/30 focus-within:border-[#C1B6FD]/30 transition-all duration-300"
      >
        {/* Attachment Button */}
        <button 
          type="button"
          className="p-3 text-gray-400 hover:text-[#C1B6FD] hover:bg-[#C1B6FD]/10 rounded-xl transition-all h-[44px] w-[44px] flex items-center justify-center shrink-0"
        >
          <PlusIconWrapper />
        </button>

        {/* Input Field */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:outline-none py-3 text-sm resize-none max-h-[120px] scrollbar-hide min-h-[44px]"
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-1 pb-1">
          <button 
            type="button"
            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          {message.trim() ? (
            <motion.button
              type="submit"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-2.5 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] text-white rounded-xl hover:shadow-lg hover:shadow-[#C1B6FD]/25 transition-all"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          ) : (
            <button
              type="button"
              className={`p-2 rounded-lg transition-all ${isRecording ? 'text-red-500 bg-red-500/10 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function PlusIconWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
      >
        <Paperclip className="w-5 h-5" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-0 mb-4 p-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex flex-col gap-1 min-w-[160px]"
          >
            <button className="flex items-center gap-3 w-full p-2 hover:bg-white/5 rounded-lg text-left text-sm text-gray-300 hover:text-white transition-colors">
              <Image className="w-4 h-4 text-emerald-400" />
              <span>Photos & Videos</span>
            </button>
            <button className="flex items-center gap-3 w-full p-2 hover:bg-white/5 rounded-lg text-left text-sm text-gray-300 hover:text-white transition-colors">
              <Paperclip className="w-4 h-4 text-blue-400" />
              <span>Document</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
