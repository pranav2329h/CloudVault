import api from './api';

const normalizeFile = (file) => ({
  ...file,
  id: file.id,
  name: file.name || file.originalName || file.filename || 'untitled',
  size: Number(file.size || 0),
  updatedAt: file.updatedAt || file.createdAt || new Date().toISOString(),
  category: file.category || 'OTHER',
  shared: Boolean(file.shared),
  shareAccess: file.shareAccess || 'private',
  shareToken: file.shareToken || null,
});

const normalizeFileListResponse = (data) => ({
  ...data,
  files: Array.isArray(data?.files) ? data.files.map(normalizeFile) : [],
  pagination: data?.pagination || {
    total: data?.count || 0,
    page: 1,
    limit: 12,
    totalPages: 1
  }
});

const fileService = {
  /**
   * Fetch list of files with optional filters, search, sorting, and pagination
   * @param {Object} params { search, category, sort, order, page, limit }
   */
  getFiles: async (params = {}) => {
    const response = await api.get('/files', { params });
    return normalizeFileListResponse(response.data);
  },

  /**
   * Fetch recent uploads for dashboard
   * @param {number} limit
   */
  getRecentUploads: async (limit = 5) => {
    const response = await api.get('/files/recent', { params: { limit } });
    return Array.isArray(response.data?.files)
      ? response.data.files.map(normalizeFile)
      : [];
  },

  /**
   * Upload a file to backend storage with progress tracking
   * @param {File} file
   * @param {Function} onProgress
   */
  uploadFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/files/upload', formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });

    return response.data?.file ? normalizeFile(response.data.file) : response.data;
  },

  /**
   * Rename a file
   * @param {string} fileId
   * @param {string} newName
   */
  renameFile: async (fileId, newName) => {
    const response = await api.put(`/files/${fileId}`, { name: newName });
    return response.data?.file ? normalizeFile(response.data.file) : response.data;
  },

  /**
   * Delete a file from storage and database
   * @param {string} fileId
   */
  deleteFile: async (fileId) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },

  /**
   * Trigger file download
   * @param {Object} file
   */
  downloadFile: async (file) => {
    const response = await api.get(`/files/${file.id}/download`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  },

  /**
   * Update file share settings (Google Drive style)
   */
  updateShareSettings: async (fileId, settings) => {
    const response = await api.put(`/files/${fileId}/share`, settings);
    return response.data?.file ? normalizeFile(response.data.file) : response.data;
  },

  /**
   * Get shared file info by token
   */
  getSharedFile: async (shareToken) => {
    const response = await api.get(`/files/share/${shareToken}`);
    return response.data?.file ? normalizeFile(response.data.file) : response.data;
  },

  /**
   * Download shared file by token
   */
  downloadSharedFile: async (shareToken, fileName = 'download') => {
    const response = await api.get(`/files/share/${shareToken}/download`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  },

  /**
   * Get file blob for previewing inside modal
   */
  getFileBlob: async (file) => {
    const response = await api.get(`/files/${file.id}/download`, { responseType: 'blob' });
    return response.data;
  }
};

export default fileService;
