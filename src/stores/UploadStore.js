import { create } from 'zustand';
import uploadService from '../api/uploadApi';

const useUploadStore = create((set) => ({
  uploadProgress: 0,
  isLoading: false,
  error: null,
  uploadedFile: null,

  // Upload a file
  uploadFile: async (formData, onProgress) => {
    set({ isLoading: true, error: null, uploadProgress: 0 });
    try {
      const response = await uploadService.uploadFile(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        set({ uploadProgress: progress });
        if (onProgress) onProgress(progress);
      });

      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to upload file');
      }

      const file = payload?.file || payload?.data || payload;
      set({ uploadedFile: file, isLoading: false, uploadProgress: 100 });
      return { success: true, data: file };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to upload file';
      set({ error: errorMessage, isLoading: false, uploadProgress: 0 });
      return { success: false, error: errorMessage };
    }
  },

  // Multiple file upload
  uploadMultiple: async (formData, onProgress) => {
    set({ isLoading: true, error: null, uploadProgress: 0 });
    try {
      const response = await uploadService.uploadFile(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        set({ uploadProgress: progress });
        if (onProgress) onProgress(progress);
      });

      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.status === 'success';

      if (!ok) {
        throw new Error(payload?.message || 'Failed to upload files');
      }

      const files = Array.isArray(payload?.files) ? payload.files : Array.isArray(payload?.data) ? payload.data : [payload];
      set({ uploadedFile: files, isLoading: false, uploadProgress: 100 });
      return { success: true, data: files };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to upload files';
      set({ error: errorMessage, isLoading: false, uploadProgress: 0 });
      return { success: false, error: errorMessage };
    }
  },

  // Reset upload state
  resetUpload: () => set({ uploadProgress: 0, uploadedFile: null, error: null }),

  clearError: () => set({ error: null })
}));

export default useUploadStore;
