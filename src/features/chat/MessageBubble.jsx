import { CheckCheck, Check } from 'lucide-react';

function fmtTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message, isMine }) {
  const content = message.content || message.text || '';
  const time = fmtTime(message.sentAt || message.createdAt);
  const status = message.status;

  return (
    <div className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
      {!isMine && (
        <div className="w-7 h-7 rounded-full bg-linear-to-br from-[#745CB4] to-[#3D2C6B] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mb-0.5 shadow-sm">
          {(message.sender?.name || message.senderName || '?')[0].toUpperCase()}
        </div>
      )}

      <div className={`group flex flex-col max-w-[72%] ${isMine ? 'items-end' : 'items-start'}`}>
        {!isMine && message.sender?.name && (
          <span className="text-[10px] text-[#9CA3AF] mb-1 ml-1">
            {message.sender.name}
          </span>
        )}

        <div
          className={`relative px-4 py-2.5 shadow-sm ${
            isMine
              ? 'bg-[#745CB4]/75 border border-[#C1B6FD]/25 text-white rounded-2xl rounded-br-sm'
              : 'bg-[#241A3A]/70 border border-[#745CB4]/20 text-[#E5E7EB] rounded-2xl rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">{content}</p>
        </div>

        <div className={`flex items-center gap-1 mt-1 px-1 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-[#6B7280]">{time}</span>
          {isMine && (
            <span className="text-[10px]">
              {status === 'read' ? (
                <CheckCheck className="w-3 h-3 text-[#C1B6FD]" />
              ) : status === 'delivered' ? (
                <CheckCheck className="w-3 h-3 text-[#6B7280]" />
              ) : (
                <Check className="w-3 h-3 text-[#6B7280]" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
