import { create } from 'zustand';
import collaborationTasksService from '../api/CollaborationTasksApi';

const useCollaborationTasksStore = create((set) => ({
  tasks: [],
  groupedCollaborations: [],
  currentTask: null,
  isLoading: false,
  error: null,

  // Get tasks by collaboration
  getTasksByCollaboration: async (collaborationId, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationTasksService.getTasksByCollaboration(collaborationId, params);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || Array.isArray(payload);

      if (!ok && !payload?.tasks) {
        throw new Error(payload?.message || 'Failed to fetch tasks');
      }

      const tasks = payload?.tasks || payload?.data || (Array.isArray(payload) ? payload : []);
      set({ tasks, isLoading: false });
      return { success: true, data: tasks };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch tasks';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get task by ID
  getTaskById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationTasksService.getTaskById(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success' || payload?.task;

      if (!ok) {
        throw new Error(payload?.message || 'Failed to fetch task');
      }

      const task = payload?.task || payload?.data || payload;
      set({ currentTask: task, isLoading: false });
      return { success: true, data: task };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch task';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Update a task
  updateTask: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationTasksService.updateTask(id, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to update task');
      }

      const task = payload?.task || payload?.data || payload;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id || t._id === id ? { ...t, ...task } : t)),
        currentTask: task,
        isLoading: false
      }));
      return { success: true, data: task };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to update task';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Start a task
  startTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationTasksService.startTask(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to start task');
      }

      const task = payload?.task || payload?.data || payload;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id || t._id === id ? { ...t, ...task } : t)),
        currentTask: task,
        isLoading: false
      }));
      return { success: true, data: task };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to start task';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Submit a task
  submitTask: async (id, data = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationTasksService.submitTask(id, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to submit task');
      }

      const task = payload?.task || payload?.data || payload;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id || t._id === id ? { ...t, ...task } : t)),
        currentTask: task,
        isLoading: false
      }));
      return { success: true, data: task };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to submit task';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Approve a task
  approveTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationTasksService.approveTask(id);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to approve task');
      }

      const task = payload?.task || payload?.data || payload;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id || t._id === id ? { ...t, ...task } : t)),
        currentTask: task,
        isLoading: false
      }));
      return { success: true, data: task };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to approve task';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Reject a task
  rejectTask: async (id, data = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationTasksService.rejectTask(id, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to reject task');
      }

      const task = payload?.task || payload?.data || payload;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id || t._id === id ? { ...t, ...task } : t)),
        currentTask: task,
        isLoading: false
      }));
      return { success: true, data: task };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to reject task';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Final rejection of a task
  rejectTaskFinal: async (id, data = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationTasksService.rejectTaskFinal(id, data);
      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to reject task finally');
      }

      const task = payload?.task || payload?.data || payload;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id || t._id === id ? { ...t, ...task } : t)),
        currentTask: task,
        isLoading: false
      }));
      return { success: true, data: task };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to reject task finally';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get all collaborations + nested tasks for the authenticated owner
  getMyTasksAsOwner: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationTasksService.getMyTasksAsOwner();
      const payload = response?.data ?? response ?? {};
      const collaborations = payload?.collaborations || [];
      set({ groupedCollaborations: collaborations, isLoading: false });
      return { success: true, data: collaborations };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch owner tasks';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Get all collaborations + nested tasks for the authenticated influencer
  getMyTasksAsInfluencer: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await collaborationTasksService.getMyTasksAsInfluencer();
      const payload = response?.data ?? response ?? {};
      const collaborations = payload?.collaborations || [];
      set({ groupedCollaborations: collaborations, isLoading: false });
      return { success: true, data: collaborations };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to fetch influencer tasks';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null })
}));

export default useCollaborationTasksStore;
