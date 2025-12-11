import api from './axiosConfig';

export const materialApi = {
  // Lấy tất cả tài liệu
  getMaterials: async () => {
    try {
      const response = await api.get('/materials');
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching all materials:', error);
      throw error;
    }
  },
  // Get materials by class
  getMaterialsByClass: async (classId) => {
    if (!classId) {
      throw new Error('Class ID is required');
    }
    try {
      const response = await api.get(`/materials/class/${classId}`);
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching materials:', {
        error: error.message,
        classId,
        url: error.config?.url,
        status: error.response?.status,
        responseData: error.response?.data
      });
      throw error;
    }
  },

  uploadMaterial: async (classId, title, file, config = {}) => {
    if (!classId) {
      console.error('Error: classId is required');
      throw new Error('Class ID is required');
    }
    
    try {
      console.log('Preparing to upload file:', {
        classId,
        title,
        fileName: file?.name,
        fileType: file?.type,
        fileSize: file?.size
      });

      if (!file) {
        throw new Error('No file provided for upload');
      }

      const formData = new FormData();
      formData.append('class_id', classId);
      formData.append('title', title);
      formData.append('file', file);

      console.log('Sending file upload request');
      
      const response = await api.post('/materials/upload', formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload failed:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
      enhancedError.response = error.response;
      throw enhancedError;
    }
  },

  deleteMaterial: async (materialId) => {
    try {
      const response = await api.delete(`/materials/${materialId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  }
};

export default materialApi;
