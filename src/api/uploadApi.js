import api from '../config/axios';

const uploadService = {

  // POST /api/upload/image
  // Upload a single image
  uploadSingleImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload single image error:', error);
      throw error.response?.data?.message || 'Failed to upload image';
    }
  },

  // POST /api/upload/images
  // Upload multiple images
  uploadMultipleImages: async (imageFiles) => {
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await api.post('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload multiple images error:', error);
      throw error.response?.data?.message || 'Failed to upload images';
    }
  },

  // POST /api/upload/document
  // Upload a document (PDF or DOCX)
  uploadDocument: async (documentFile) => {
    try {
      const formData = new FormData();
      formData.append('document', documentFile);

      const response = await api.post('/upload/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload document error:', error);
      throw error.response?.data?.message || 'Failed to upload document';
    }
  },

  // GET /api/upload/{fileId}
  // Get file metadata
  getFileMetadata: async (fileId) => {
    try {
      const response = await api.get(`/upload/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Get file metadata error:', error);
      throw error.response?.data?.message || 'Failed to fetch file metadata';
    }
  },

  // DELETE /api/upload/{fileId}
  // Delete uploaded file
  deleteFile: async (fileId) => {
    try {
      const response = await api.delete(`/upload/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Delete file error:', error);
      throw error.response?.data?.message || 'Failed to delete file';
    }
  },
};

export default uploadService;