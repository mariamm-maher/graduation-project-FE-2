import { create } from 'zustand';
import chatService from '../api/chatApi';

const useChatStore = create((set) => ({
  chatRooms: [],
  currentRoom: null,
  messages: [],
  isLoading: false,
  error: null,
  isMessagesLoading: false,

  // Get chat room for a collaboration
  getChatRoom: async (collaborationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatService.getChatRoom(collaborationId);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.room;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch chat room');
      }

      const room = payload?.room || payload?.data || payload;
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
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.rooms) {
        throw new Error(payload?.message || 'Failed to fetch chat rooms');
      }

      const rooms = payload?.rooms || payload?.data || (Array.isArray(payload) ? payload : []);
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
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.messages) {
        throw new Error(payload?.message || 'Failed to fetch messages');
      }

      const messages = payload?.messages || payload?.data || (Array.isArray(payload) ? payload : []);
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
      const response = await chatService.sendMessage(chatRoomId, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to send message');
      }

      const message = payload?.message || payload?.data || payload;
      set((state) => ({
        messages: [...state.messages, message]
      }));
      return { success: true, data: message };
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

      return { success: true };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to mark room as read';
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null })
}));

export default useChatStore;
