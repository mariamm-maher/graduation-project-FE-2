import api from '../config/axios';

const collaborationTasksService = {
  // GET /api/collaboration-tasks/collaboration/{collaborationId}
  // Get tasks for a collaboration
  getTasksByCollaboration: async (collaborationId, params = {}) => {
    try {
      const { status } = params;
      const query = new URLSearchParams();
      if (status) query.set('status', status);
      const response = await api.get(`/collaboration-tasks/collaboration/${collaborationId}?${query.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get collaboration tasks error:', error);
      throw error.response?.data?.message || 'Failed to fetch collaboration tasks';
    }
  },

  // GET /api/collaboration-tasks/{id}
  // Get task by ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(`/collaboration-tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get task by ID error:', error);
      throw error.response?.data?.message || 'Failed to fetch task';
    }
  },

  // PATCH /api/collaboration-tasks/{id}
  // Update a task
  updateTask: async (id, data) => {
    try {
      const response = await api.patch(`/collaboration-tasks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update task error:', error);
      throw error.response?.data?.message || 'Failed to update task';
    }
  },

  // PATCH /api/collaboration-tasks/{id}/start
  // Mark task as started
  startTask: async (id) => {
    try {
      const response = await api.patch(`/collaboration-tasks/${id}/start`);
      return response.data;
    } catch (error) {
      console.error('Start task error:', error);
      throw error.response?.data?.message || 'Failed to start task';
    }
  },

  // PATCH /api/collaboration-tasks/{id}/submit
  // Submit task for review
  submitTask: async (id, data) => {
    try {
      const response = await api.patch(`/collaboration-tasks/${id}/submit`, data);
      return response.data;
    } catch (error) {
      console.error('Submit task error:', error);
      throw error.response?.data?.message || 'Failed to submit task';
    }
  },

  // PATCH /api/collaboration-tasks/{id}/approve
  // Approve a task
  approveTask: async (id) => {
    try {
      const response = await api.patch(`/collaboration-tasks/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Approve task error:', error);
      throw error.response?.data?.message || 'Failed to approve task';
    }
  },

  // PATCH /api/collaboration-tasks/{id}/reject
  // Reject a task
  rejectTask: async (id, data = {}) => {
    try {
      const response = await api.patch(`/collaboration-tasks/${id}/reject`, data);
      return response.data;
    } catch (error) {
      console.error('Reject task error:', error);
      throw error.response?.data?.message || 'Failed to reject task';
    }
  },

  // PATCH /api/collaboration-tasks/{id}/reject-final
  // Final rejection of a task
  rejectTaskFinal: async (id, data = {}) => {
    try {
      const response = await api.patch(`/collaboration-tasks/${id}/reject-final`, data);
      return response.data;
    } catch (error) {
      console.error('Reject task final error:', error);
      throw error.response?.data?.message || 'Failed to reject task finally';
    }
  }
};

export default collaborationTasksService;
