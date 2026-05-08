import { useEffect } from 'react';
import { Mail, MailOpen, Clock, User } from 'lucide-react';
import useOwnerStore from '../../../../../../../stores/ownerStore';

function getTimeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? 'Just now' : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function InterestMessageCard({ msg, onMarkRead }) {
  return (
    <div
      className={`relative bg-[#1A112C]/65 backdrop-blur-sm border rounded-lg p-4 mb-2.5 last:mb-0 border-l-4 transition-all ${
        msg.isRead
          ? 'border-[#745CB4]/20 border-l-[#745CB4]/30'
          : 'border-[#745CB4]/35 border-l-[#C1B6FD]/60'
      }`}
    >
      {/* Unread dot */}
      {!msg.isRead && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#C1B6FD]" />
      )}

      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#745CB4]/25 flex items-center justify-center text-[#C1B6FD] font-bold text-xs shrink-0">
          {(msg.influencerName || 'I').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{msg.influencerName || 'Influencer'}</p>
          <p className="text-xs text-[#C1B6FD] truncate">{msg.campaignName}</p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#9CA3AF] shrink-0">
          <Clock className="w-3 h-3" />
          {getTimeAgo(msg.createdAt)}
        </div>
      </div>

      {/* Message body */}
      <p className="text-sm text-[#D1D5DB] leading-relaxed border-l-2 border-[#745CB4]/40 pl-3 mb-3">
        {msg.message}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {msg.influencerEmail && (
          <a
            href={`mailto:${msg.influencerEmail}`}
            className="inline-flex items-center gap-1.5 text-[11px] text-[#C1B6FD] hover:underline"
          >
            <User className="w-3 h-3" />
            {msg.influencerEmail}
          </a>
        )}
        {!msg.isRead && (
          <button
            onClick={() => onMarkRead(msg.id)}
            className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#241A3A]/70 border border-[#745CB4]/45 text-[#C1B6FD] hover:border-[#C1B6FD]/60 transition-all"
          >
            <MailOpen className="w-3.5 h-3.5" />
            Mark read
          </button>
        )}
      </div>
    </div>
  );
}

export default function InterestMessagesPane() {
  const {
    interestMessages,
    interestMessagesLoading,
    interestMessagesError,
    interestMessagesUnread,
    fetchInterestMessages,
    markInterestMessageRead,
  } = useOwnerStore();

  useEffect(() => {
    fetchInterestMessages();
  }, [fetchInterestMessages]);

  return (
    <div className="bg-[#241A3A]/65 backdrop-blur-md border border-[#745CB4]/25 rounded-xl p-3.5">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#C1B6FD]" />
          <span className="text-sm font-semibold text-white">Interest Messages</span>
          {interestMessagesUnread > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-[#C1B6FD] text-[#1A112C] leading-none">
              {interestMessagesUnread}
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#9CA3AF] bg-[#1A112C]/70 border border-[#745CB4]/25 rounded-full px-2 py-0.5">
          {interestMessages.length}
        </span>
      </div>

      {interestMessagesError && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-2">
          {interestMessagesError}
        </p>
      )}

      {interestMessagesLoading && (
        <p className="text-xs text-[#C1B6FD] mb-2">Loading messages...</p>
      )}

      {!interestMessagesLoading && interestMessages.length === 0 && (
        <p className="text-xs text-[#9CA3AF] py-1">
          No interest messages yet. They appear when influencers contact you about a campaign.
        </p>
      )}

      {interestMessages.map(msg => (
        <InterestMessageCard
          key={msg.id}
          msg={msg}
          onMarkRead={markInterestMessageRead}
        />
      ))}
    </div>
  );
}
