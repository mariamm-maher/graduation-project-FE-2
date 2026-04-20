// import { useEffect, useMemo, useRef, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';
// // import ChatSidebar from '../../ownerDashboard/components/collaborations/messages/ChatSidebar';
// // import ChatWindow from '../../ownerDashboard/components/collaborations/messages/ChatWindow';
// // import useChatStore from '../../../../stores/ChatStore';
// // import useAuthStore from '../../../../stores/authStore';

// const formatTimestamp = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   if (Number.isNaN(date.getTime())) return '';
//   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// };

// export default function Messages({
//   userRole = 'influencer',
//   chatRoomId = null,
//   otherUserId = null,
//   className = ''
// }) {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const location = useLocation();
//   const authUser = useAuthStore((state) => state.user);

//   const {
//     chatRooms,
//     getChatRooms,
//     getMessages,
//     sendMessage,
//     markRoomAsRead,
//     messages,
//     initSocket,
//     disconnectSocket,
//     setActiveRoom,
//     joinRoom,
//     joinCollaborationChat,
//     leaveRoom
//   } = useChatStore();

//   const currentUserId = authUser?.userId || authUser?.id;
//   const roomFromQuery = new URLSearchParams(location.search).get('room');

//   const effectiveSelectedChat = selectedChat || chatRoomId || roomFromQuery;

//   const activeRoomRef = useRef(null);
//   const markReadAtRef = useRef(new Map());

//   useEffect(() => {
//     initSocket();
//     getChatRooms();

//     return () => {
//       if (activeRoomRef.current) {
//         leaveRoom(activeRoomRef.current);
//         activeRoomRef.current = null;
//       }
//       setActiveRoom(null);
//       disconnectSocket();
//     };
//   }, [getChatRooms, initSocket, disconnectSocket, leaveRoom, setActiveRoom]);

//   const filteredRooms = useMemo(() => {
//     if (!otherUserId) return chatRooms || [];

//     return (chatRooms || []).filter((room) => {
//       if (!Array.isArray(room?.participants)) return false;
//       return room.participants.some((participant) => String(participant?.id || participant?.userId) === String(otherUserId));
//     });
//   }, [chatRooms, otherUserId]);

//   const selectedRoom = useMemo(
//     () => (filteredRooms || []).find((room) => String(room.id || room._id) === String(effectiveSelectedChat)),
//     [filteredRooms, effectiveSelectedChat]
//   );

//   useEffect(() => {
//     if (!effectiveSelectedChat) {
//       setActiveRoom(null);
//       return;
//     }

//     const roomKey = String(effectiveSelectedChat);
//     setActiveRoom(roomKey);

//     if (activeRoomRef.current !== roomKey) {
//       if (activeRoomRef.current) {
//         leaveRoom(activeRoomRef.current);
//       }

//       joinRoom(roomKey);
//       activeRoomRef.current = roomKey;
//     }

//     getMessages(roomKey);

//     const now = Date.now();
//     const lastMarkedAt = markReadAtRef.current.get(roomKey) || 0;
//     if (now - lastMarkedAt > 1200) {
//       markRoomAsRead(roomKey);
//       markReadAtRef.current.set(roomKey, now);
//     }

//     if (selectedRoom?.collaborationId) {
//       joinCollaborationChat(selectedRoom.collaborationId);
//     }
//   }, [
//     effectiveSelectedChat,
//     selectedRoom?.collaborationId,
//     getMessages,
//     markRoomAsRead,
//     joinRoom,
//     leaveRoom,
//     joinCollaborationChat
//     ,
//     setActiveRoom
//   ]);

//   const conversations = filteredRooms?.length > 0 ? filteredRooms : [];

//   const normalizedConversations = conversations.map((room) => {
//     const roomId = room.id || room._id;
//     const otherParticipant = Array.isArray(room.participants)
//       ? room.participants.find((p) => String(p.id || p.userId) !== String(currentUserId))
//       : null;

//     const displayName = room.name || otherParticipant?.name || otherParticipant?.userName || 'Chat';
//     const initials = displayName
//       .split(' ')
//       .map((part) => part[0])
//       .join('')
//       .slice(0, 2)
//       .toUpperCase();

//     return {
//       ...room,
//       id: roomId,
//       name: displayName,
//       avatar: initials || 'CH',
//       avatarColor: 'from-[#745CB4] to-[#C1B6FD]',
//       lastMessage: room.lastMessage?.content || room.lastMessage || 'No messages yet',
//       timestamp: formatTimestamp(room.lastMessage?.sentAt || room.updatedAt),
//       unread: Number(room.unreadCount || 0),
//       campaign: room?.collaborationId ? `Collaboration #${room.collaborationId}` : `${userRole} chat`,
//       active: true,
//       online: false
//     };
//   });

//   const currentMessages = (messages || []).map((msg) => {
//     const senderId = msg.senderId || msg?.sender?.id;
//     const isMe = String(senderId) === String(currentUserId);
//     return {
//       id: msg.id || msg._id,
//       text: msg.content || msg.text || '',
//       timestamp: formatTimestamp(msg.sentAt || msg.createdAt),
//       status: msg.status || 'sent',
//       sender: isMe ? 'me' : 'other'
//     };
//   });

//   const handleSendMessage = async (text) => {
//     if (!effectiveSelectedChat) {
//       toast.error('Please select a chat first');
//       return;
//     }

//     const res = await sendMessage(effectiveSelectedChat, { content: text });
//     if (!res?.success) {
//       toast.error(res?.error || 'Failed to send message');
//     }
//   };

//   const activeConversation = normalizedConversations.find((c) => String(c.id) === String(effectiveSelectedChat));

//   return (
//     <div className={`h-[calc(100vh-6rem)] w-full max-w-[1600px] mx-auto bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex ${className}`}>
//       <ChatSidebar
//         conversations={normalizedConversations}
//         selectedChat={effectiveSelectedChat}
//         onSelectChat={setSelectedChat}
//         showMobile={!effectiveSelectedChat}
//       />

//       <ChatWindow
//         conversation={activeConversation}
//         messages={currentMessages}
//         onSendMessage={handleSendMessage}
//         onBack={() => setSelectedChat(null)}
//         showMobile={!!effectiveSelectedChat}
//       />
//     </div>
//   );
// }
