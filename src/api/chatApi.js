import api from '../config/axios';

const chatService = {

  // GET /api/chat/collaboration/{collaborationId}
  // Get or create a collaboration chat room
  getOrCreateCollaborationChat: async (collaborationId) => {
    try {
      const response = await api.get(`/chat/collaboration/${collaborationId}`);
      return response.data;
    } catch (error) {
      console.error('Get/create chat room error:', error);
      throw error.response?.data?.message || 'Failed to get or create collaboration chat room';
    }
  },

  // GET /api/chat/rooms
  // Get all chat rooms for the authenticated user
  getMyChatRooms: async () => {
    try {
      const response = await api.get('/chat/rooms');
      return response.data;
    } catch (error) {
      console.error('Get my chat rooms error:', error);
      throw error.response?.data?.message || 'Failed to fetch chat rooms';
    }
  },

  // GET /api/chat/rooms/{chatRoomId}
  // Get chat room details
  getChatRoomById: async (chatRoomId) => {
    try {
      const response = await api.get(`/chat/rooms/${chatRoomId}`);
      return response.data;
    } catch (error) {
      console.error('Get chat room details error:', error);
      throw error.response?.data?.message || 'Failed to fetch chat room details';
    }
  },

  // GET /api/chat/rooms/{chatRoomId}/messages
  // Get message history for a chat room
  getChatMessages: async (chatRoomId, params = {}) => {
    try {
      const { page = 1, limit = 50 } = params;
      const query = new URLSearchParams({ page, limit });
      const response = await api.get(`/chat/rooms/${chatRoomId}/messages?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get chat messages error:', error);
      throw error.response?.data?.message || 'Failed to fetch chat messages';
    }
  },

  // POST /api/chat/rooms/{chatRoomId}/messages
  // Send a message in a chat room
  sendMessage: async (chatRoomId, data) => {
    try {
      const response = await api.post(`/chat/rooms/${chatRoomId}/messages`, data);
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error.response?.data?.message || 'Failed to send message';
    }
  },

  // PUT /api/chat/messages/{messageId}
  // Edit a message
  editMessage: async (messageId, data) => {
    try {
      const response = await api.put(`/chat/messages/${messageId}`, data);
      return response.data;
    } catch (error) {
      console.error('Edit message error:', error);
      throw error.response?.data?.message || 'Failed to edit message';
    }
  },

  // DELETE /api/chat/messages/{messageId}
  // Delete a message
  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(`/chat/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Delete message error:', error);
      throw error.response?.data?.message || 'Failed to delete message';
    }
  },

  // POST /api/chat/rooms/{chatRoomId}/read
  // Mark all messages in a chat room as read
  markRoomAsRead: async (chatRoomId) => {
    try {
      const response = await api.post(`/chat/rooms/${chatRoomId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark room as read error:', error);
      throw error.response?.data?.message || 'Failed to mark chat room as read';
    }
  },
};

export default chatService;