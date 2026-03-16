import { create } from 'zustand';
import chatService from '../api/chatApi';
import { connectChatSocket, disconnectChatSocket, getChatSocket } from '../utils/chatSocket';

const useChatStore = create((set) => ({
  chatRooms: [],
  currentRoom: null,
  messages: [],
  connected: false,
  typingUsers: [],
  isLoading: false,
  error: null,
  isMessagesLoading: false,

  normalizeRooms: (rooms = []) => {
    if (!Array.isArray(rooms)) return [];
    return rooms.map((room) => ({
      ...room,
      id: room.id || room._id,
      collaborationId: room.collaborationId || room?.collaboration?.id || null,
      unreadCount: Number(room.unreadCount || 0)
    }));
  },

  normalizeMessages: (messages = []) => {
    if (!Array.isArray(messages)) return [];
    return messages
      .map((message) => ({
        ...message,
        id: message.id || message._id,
        chatRoomId: message.chatRoomId || message.roomId,
        senderId: message.senderId || message?.sender?.id,
        content: message.content || message.text || '',
        sentAt: message.sentAt || message.createdAt || new Date().toISOString(),
        status: message.status || 'sent'
      }))
      .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
  },

  initSocket: () => {
    const existing = getChatSocket();
    if (existing) return;

    const socket = connectChatSocket();

    socket.on('connect', () => {
      set({ connected: true, error: null });
    });

    socket.on('disconnect', () => {
      set({ connected: false });
    });

    socket.on('connect_error', (err) => {
      set({ error: err?.message || 'Socket connection error' });
    });

    socket.on('error', (payload) => {
      const message = payload?.message || 'Socket event failed';
      set({ error: message });
    });

    socket.on('message_received', (incoming) => {
      set((state) => {
        const messageId = incoming?.id || incoming?._id;
        const roomId = incoming?.chatRoomId || incoming?.roomId;
        const currentRoomId = state.currentRoom?.id || state.currentRoom?._id;

        const alreadyExists = state.messages.some((m) => (m.id || m._id) === messageId);
        if (alreadyExists) return state;

        const normalizedMessage = {
          ...incoming,
          id: messageId,
          chatRoomId: roomId,
          senderId: incoming?.senderId || incoming?.sender?.id,
          content: incoming?.content || '',
          sentAt: incoming?.sentAt || new Date().toISOString(),
          status: incoming?.status || 'delivered'
        };

        const updatedRooms = state.chatRooms.map((room) => {
          const id = room.id || room._id;
          if (id !== roomId) return room;

          const shouldIncrementUnread = currentRoomId !== id;
          return {
            ...room,
            lastMessage: normalizedMessage,
            unreadCount: shouldIncrementUnread ? Number(room.unreadCount || 0) + 1 : 0,
            updatedAt: normalizedMessage.sentAt
          };
        });

        const nextMessages = roomId === currentRoomId
          ? [...state.messages, normalizedMessage].sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
          : state.messages;

        return {
          chatRooms: updatedRooms,
          messages: nextMessages
        };
      });
    });

    socket.on('messages_read', ({ chatRoomId, messageIds }) => {
      set((state) => {
        const updatedMessages = state.messages.map((message) => {
          if ((message.chatRoomId || message.roomId) !== chatRoomId) return message;
          if (messageIds === 'all' || (Array.isArray(messageIds) && messageIds.includes(message.id || message._id))) {
            return { ...message, status: 'read' };
          }
          return message;
        });

        const updatedRooms = state.chatRooms.map((room) => {
          const id = room.id || room._id;
          if (id !== chatRoomId) return room;
          return { ...room, unreadCount: 0 };
        });

        return { messages: updatedMessages, chatRooms: updatedRooms };
      });
    });

    socket.on('user_typing', ({ userId, chatRoomId }) => {
      set((state) => {
        const exists = state.typingUsers.some((u) => u.userId === userId && u.chatRoomId === chatRoomId);
        if (exists) return state;
        return { typingUsers: [...state.typingUsers, { userId, chatRoomId }] };
      });
    });

    socket.on('user_stopped_typing', ({ userId, chatRoomId }) => {
      set((state) => ({
        typingUsers: state.typingUsers.filter((u) => !(u.userId === userId && u.chatRoomId === chatRoomId))
      }));
    });
  },

  disconnectSocket: () => {
    disconnectChatSocket();
    set({ connected: false, typingUsers: [] });
  },

  joinCollaborationChat: (collaborationId) => {
    const socket = getChatSocket();
    if (!socket || !collaborationId) return;
    socket.emit('join_collaboration_chat', { collaborationId });
  },

  leaveRoom: (chatRoomId) => {
    const socket = getChatSocket();
    if (!socket || !chatRoomId) return;
    socket.emit('leave_room', { chatRoomId });
  },

  emitTyping: (chatRoomId) => {
    const socket = getChatSocket();
    if (!socket || !chatRoomId) return;
    socket.emit('typing', { chatRoomId });
  },

  emitStopTyping: (chatRoomId) => {
    const socket = getChatSocket();
    if (!socket || !chatRoomId) return;
    socket.emit('stop_typing', { chatRoomId });
  },

  emitMarkMessagesRead: (chatRoomId, messageIds = 'all') => {
    const socket = getChatSocket();
    if (!socket || !chatRoomId) return;
    socket.emit('mark_messages_read', { chatRoomId, messageIds });
  },

  // Get chat room for a collaboration
  getChatRoom: async (collaborationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatService.getOrCreateCollaborationChat(collaborationId);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.chatRoom;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch chat room');
      }

      const room = payload?.chatRoom || payload?.room || payload?.data || payload;
      set({ currentRoom: room, isLoading: false });
      return { success: true, data: room };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch chat room';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get all chat rooms
  getChatRooms: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatService.getChatRooms(params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload) || Array.isArray(payload?.chatRooms);

      if (!ok && !payload?.rooms && !payload?.chatRooms) {
        throw new Error(payload?.message || 'Failed to fetch chat rooms');
      }

      const rawRooms = payload?.chatRooms || payload?.rooms || payload?.data || (Array.isArray(payload) ? payload : []);
      const rooms = useChatStore.getState().normalizeRooms(rawRooms);
      set({ chatRooms: rooms, isLoading: false });
      return { success: true, data: rooms };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch chat rooms';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get messages for a room
  getMessages: async (chatRoomId, params = {}) => {
    set({ isMessagesLoading: true, error: null });
    try {
      const response = await chatService.getMessages(chatRoomId, params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload) || Array.isArray(payload?.messages);

      if (!ok && !payload?.messages) {
        throw new Error(payload?.message || 'Failed to fetch messages');
      }

      const rawMessages = payload?.messages || payload?.data || (Array.isArray(payload) ? payload : []);
      const messages = useChatStore.getState().normalizeMessages(rawMessages);
      set({ messages, isMessagesLoading: false });
      return { success: true, data: messages };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch messages';
      set({ error: errorMessage, isMessagesLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Send a message
  sendMessage: async (chatRoomId, data) => {
    try {
      const socket = getChatSocket();

      if (socket && socket.connected) {
        socket.emit('send_message', {
          chatRoomId,
          content: data?.content ?? data?.text ?? '',
          mediaUrl: data?.mediaUrl ?? null,
          replyToId: data?.replyToId ?? null
        });
        return { success: true };
      }

      const response = await chatService.sendMessage(chatRoomId, {
        content: data?.content ?? data?.text ?? '',
        mediaUrl: data?.mediaUrl ?? null,
        replyToId: data?.replyToId ?? null
      });
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to send message');
      }

      const message = payload?.message || payload?.data || payload;
      const normalized = useChatStore.getState().normalizeMessages([message])[0];

      set((state) => ({
        messages: [...state.messages, normalized].sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
      }));
      return { success: true, data: normalized };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to send message';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Update a message
  updateMessage: async (messageId, data) => {
    try {
      const response = await chatService.updateMessage(messageId, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to update message');
      }

      const message = payload?.message || payload?.data || payload;
      set((state) => ({
        messages: state.messages.map((m) => (m.id === messageId || m._id === messageId ? { ...m, ...message } : m))
      }));
      return { success: true, data: message };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to update message';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    try {
      const response = await chatService.deleteMessage(messageId);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to delete message');
      }

      set((state) => ({
        messages: state.messages.filter((m) => m.id !== messageId && m._id !== messageId)
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to delete message';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Mark room as read
  markRoomAsRead: async (chatRoomId) => {
    try {
      const response = await chatService.markRoomAsRead(chatRoomId);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to mark room as read');
      }

      useChatStore.getState().emitMarkMessagesRead(chatRoomId, 'all');

      set((state) => ({
        chatRooms: state.chatRooms.map((room) => {
          const id = room.id || room._id;
          if (id !== chatRoomId) return room;
          return { ...room, unreadCount: 0 };
        })
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to mark room as read';
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null })
}));

export default useChatStore;
