import { create } from 'zustand';
import uploadService from '../api/uploadApi';

const resolveFileFromInput = (input) => {
  if (input instanceof File) {
    return input;
  }

  if (input && typeof input.get === 'function') {
    return input.get('file') || input.get('image') || null;
  }

  return null;
};

const useUploadStore = create((set) => ({
  uploadProgress: 0,
  isLoading: false,
  error: null,
  uploadedFile: null,

  // Upload a file
  uploadFile: async (fileInput, type = 'brandLogo', onProgress) => {
    set({ isLoading: true, error: null, uploadProgress: 0 });
    try {
      const file = resolveFileFromInput(fileInput);
      if (!file) {
        throw new Error('No file provided');
      }

      set({ uploadProgress: 15 });
      if (onProgress) onProgress(15);

      const response = await uploadService.uploadImage(file, type);

      const payload = response?.data ?? response ?? {};
      const ok = response?.success === true || payload?.success === true || payload?.status === 'success';

      if (!ok && !payload?.data?.url) {
        throw new Error(payload?.message || 'Failed to upload file');
      }

      const uploadedData = payload?.data || payload?.file || payload;
      set({ uploadedFile: uploadedData, isLoading: false, uploadProgress: 100 });
      if (onProgress) onProgress(100);
      return { success: true, data: uploadedData };
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to upload file';
      set({ error: errorMessage, isLoading: false, uploadProgress: 0 });
      return { success: false, error: errorMessage };
    }
  },

  // Multiple file upload
  uploadMultiple: async (files = [], type = 'campaignAsset', onProgress) => {
    set({ isLoading: true, error: null, uploadProgress: 0 });
    try {
      const normalizedFiles = Array.isArray(files) ? files : [files];
      if (normalizedFiles.length === 0) {
        throw new Error('No files provided');
      }

      const uploadedFiles = [];
      for (let i = 0; i < normalizedFiles.length; i += 1) {
        const file = resolveFileFromInput(normalizedFiles[i]);
        if (!file) {
          continue;
        }

        const response = await uploadService.uploadImage(file, type);
        const payload = response?.data ?? response ?? {};
        const uploadedData = payload?.data || payload?.file || payload;
        uploadedFiles.push(uploadedData);

        const progress = Math.round(((i + 1) * 100) / normalizedFiles.length);
        set({ uploadProgress: progress });
        if (onProgress) onProgress(progress);
      }

      if (uploadedFiles.length === 0) {
        throw new Error('Failed to upload files');
      }

      set({ uploadedFile: uploadedFiles, isLoading: false, uploadProgress: 100 });
      return { success: true, data: uploadedFiles };
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
