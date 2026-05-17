const AVATAR_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-pink-500 to-rose-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
];

export function fmtRelative(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function fmtTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function fmtDateLabel(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString();
}

function initials(name) {
  return (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function mapRoomToConversation(room, index = 0) {
  const collab = room.collaboration || {};
  const campaign =
    collab.campaign?.campaignName || room.name || `Collaboration #${room.collaborationId || room.id}`;
  const influencer =
    collab.influencer ||
    (room.participants || []).find((p) => p.role === 'influencer');
  const influencerName =
    typeof influencer === 'object'
      ? [influencer.firstName, influencer.lastName].filter(Boolean).join(' ').trim() ||
        influencer.email
      : (room.participants || []).find((p) => p.role === 'influencer')?.name;
  const displayName = influencerName || room.name || 'Collaboration chat';

  return {
    id: room.id,
    roomId: room.id,
    influencer: displayName,
    avatar: initials(displayName),
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    lastMessage: room.lastMessage?.content || 'No messages yet',
    timestamp: fmtRelative(room.lastMessage?.sentAt || room.updatedAt),
    unread: 0,
    online: false,
    campaign,
    collaborationId: room.collaborationId,
    ownerId: collab.ownerId ?? collab.owner?.id,
    influencerId: collab.influencerId ?? collab.influencer?.id,
    raw: room,
  };
}

export function mapApiMessage(msg, ownerId) {
  const senderId = msg.senderId ?? msg.sender?.id;
  const isOwner = ownerId != null && String(senderId) === String(ownerId);
  return {
    id: msg.id,
    sender: isOwner ? 'brand' : 'influencer',
    text: msg.content || '',
    timestamp: fmtTime(msg.sentAt),
    type: 'text',
    date: fmtDateLabel(msg.sentAt),
    senderName: msg.sender
      ? [msg.sender.firstName, msg.sender.lastName].filter(Boolean).join(' ').trim()
      : '',
  };
}
