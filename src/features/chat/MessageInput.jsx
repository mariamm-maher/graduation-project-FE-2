import { useRef, useState, useEffect, useCallback } from 'react';
import { Paperclip, SendHorizontal, Smile } from 'lucide-react';

const TYPING_DEBOUNCE_MS = 1800;

export default function MessageInput({ activeRoomId, onSend, onTyping, onStopTyping, disabled }) {
  const [text, setText] = useState('');
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);
  const textareaRef = useRef(null);

  const stopTyping = useCallback(() => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      onStopTyping?.(activeRoomId);
    }
    clearTimeout(typingTimerRef.current);
  }, [activeRoomId, onStopTyping]);

  useEffect(() => {
    return () => stopTyping();
  }, [activeRoomId, stopTyping]);

  const handleChange = (e) => {
    setText(e.target.value);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTyping?.(activeRoomId);
    }

    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(stopTyping, TYPING_DEBOUNCE_MS);

    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    stopTyping();
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    onSend(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="px-4 py-3 border-t border-[#745CB4]/20 bg-[#1A112C]/50 backdrop-blur-sm">
      <div
        className={`flex items-end gap-2 rounded-xl border px-3 py-2 transition-colors ${
          disabled
            ? 'border-[#745CB4]/10 bg-[#241A3A]/20 opacity-50'
            : 'border-[#745CB4]/30 bg-[#241A3A]/55 focus-within:border-[#C1B6FD]/45'
        }`}
      >
        <button
          type="button"
          disabled={disabled}
          className="p-1.5 text-[#9CA3AF] hover:text-[#C1B6FD] rounded-lg hover:bg-[#745CB4]/20 transition-colors shrink-0 mb-0.5"
          aria-label="Attach file"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? 'Select a conversation to chat…' : 'Type a message… (Enter to send)'}
          className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-[#6B7280] focus:outline-none min-h-9 max-h-[120px] py-1.5 leading-relaxed"
        />

        <button
          type="button"
          disabled={disabled}
          className="p-1.5 text-[#9CA3AF] hover:text-[#C1B6FD] rounded-lg hover:bg-[#745CB4]/20 transition-colors shrink-0 mb-0.5"
          aria-label="Emoji"
        >
          <Smile className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          aria-label="Send message"
          className="shrink-0 mb-0.5 p-2 rounded-xl border border-[#C1B6FD]/30 bg-[#745CB4]/70 text-white hover:bg-[#745CB4] transition-all disabled:opacity-35 disabled:cursor-not-allowed"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[10px] text-[#6B7280] mt-1.5 ml-1">
        Shift+Enter for new line
      </p>
    </footer>
  );
}
