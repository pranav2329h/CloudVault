import api from './api';

// Initial realistic mock files for demo/fallback when backend is offline
let MOCK_FILES = [
  {
    id: 'file-1',
    name: 'Q3 Financial Report 2026.pdf',
    size: 4500000,
    type: 'application/pdf',
    category: 'DOCUMENT',
    updatedAt: '2026-07-04T14:30:00Z',
    starred: true,
    shared: false,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 'file-2',
    name: 'Product Design System Design.fig',
    size: 18400000,
    type: 'application/octet-stream',
    category: 'IMAGE',
    updatedAt: '2026-07-03T11:15:00Z',
    starred: true,
    shared: true,
    url: '#'
  },
  {
    id: 'file-3',
    name: 'Brand Logo Kit Premium.zip',
    size: 52100000,
    type: 'application/zip',
    category: 'ARCHIVE',
    updatedAt: '2026-07-02T09:20:00Z',
    starred: false,
    shared: false,
    url: '#'
  },
  {
    id: 'file-4',
    name: 'Client Onboarding Video Presentation.mp4',
    size: 142000000,
    type: 'video/mp4',
    category: 'VIDEO',
    updatedAt: '2026-07-01T16:45:00Z',
    starred: false,
    shared: true,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'file-5',
    name: 'Executive Dashboard Analytics.xlsx',
    size: 2800000,
    type: 'application/vnd.ms-excel',
    category: 'DOCUMENT',
    updatedAt: '2026-06-29T10:00:00Z',
    starred: true,
    shared: false,
    url: '#'
  },
  {
    id: 'file-6',
    name: 'Podcast Intro Theme Track.mp3',
    size: 9500000,
    type: 'audio/mpeg',
    category: 'AUDIO',
    updatedAt: '2026-06-28T18:10:00Z',
    starred: false,
    shared: false,
    url: '#'
  },
  {
    id: 'file-7',
    name: 'Backend Microservices Architecture.png',
    size: 3400000,
    type: 'image/png',
    category: 'IMAGE',
    updatedAt: '2026-06-25T13:22:00Z',
    starred: false,
    shared: true,
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'file-8',
    name: 'API Gateway Microservices Script.js',
    size: 145000,
    type: 'text/javascript',
    category: 'CODE',
    updatedAt: '2026-06-20T08:30:00Z',
    starred: false,
    shared: false,
    url: '#'
  }
];

const fileService = {
  /**
   * Fetch list of files with optional filters, search, sorting, and pagination
   * @param {Object} params { search, category, sort, order, page, limit }
   */
  getFiles: async (params = {}) => {
    try {
      const response = await api.get('/files', { params });
      return response.data;
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        return new Promise((resolve) => {
          setTimeout(() => {
            let filtered = [...MOCK_FILES];
            
            // Search filter
            if (params.search && params.search.trim() !== '') {
              const query = params.search.toLowerCase();
              filtered = filtered.filter(f => f.name.toLowerCase().includes(query));
            }
            
            // Category filter
            if (params.category && params.category !== 'ALL') {
              filtered = filtered.filter(f => f.category === params.category);
            }
            
            // Sort
            const sortBy = params.sort || 'updatedAt';
            const order = params.order || 'desc';
            filtered.sort((a, b) => {
              let valA = a[sortBy];
              let valB = b[sortBy];
              if (typeof valA === 'string') valA = valA.toLowerCase();
              if (typeof valB === 'string') valB = valB.toLowerCase();
              if (valA < valB) return order === 'asc' ? -1 : 1;
              if (valA > valB) return order === 'asc' ? 1 : -1;
              return 0;
            });

            // Pagination
            const page = parseInt(params.page) || 1;
            const limit = parseInt(params.limit) || 12;
            const total = filtered.length;
            const totalPages = Math.ceil(total / limit) || 1;
            const startIndex = (page - 1) * limit;
            const paginatedFiles = filtered.slice(startIndex, startIndex + limit);

            resolve({
              files: paginatedFiles,
              pagination: {
                total,
                page,
                limit,
                totalPages
              }
            });
          }, 400);
        });
      }
      throw error;
    }
  },

  /**
   * Fetch recent uploads for dashboard
   * @param {number} limit 
   */
  getRecentUploads: async (limit = 5) => {
    try {
      const response = await api.get('/files/recent', { params: { limit } });
      return response.data;
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        return new Promise((resolve) => {
          setTimeout(() => {
            const sorted = [...MOCK_FILES].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            resolve(sorted.slice(0, limit));
          }, 300);
        });
      }
      throw error;
    }
  },

  /**
   * Upload a file to S3 via backend with progress tracking
   * @param {File} file 
   * @param {Function} onProgress 
   */
  uploadFile: async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        }
      });
      return response.data;
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        return new Promise((resolve) => {
          // Simulate upload progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 25) + 15;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              if (onProgress) onProgress(100);
              
              // Add mock file to list
              const ext = file.name.split('.').pop().toLowerCase();
              let cat = 'OTHER';
              if (['jpg','jpeg','png','gif','webp'].includes(ext)) cat = 'IMAGE';
              else if (['mp4','mov','avi','webm'].includes(ext)) cat = 'VIDEO';
              else if (['mp3','wav','ogg'].includes(ext)) cat = 'AUDIO';
              else if (['pdf','doc','docx','xls','xlsx','ppt','txt'].includes(ext)) cat = 'DOCUMENT';
              else if (['zip','rar','7z','tar'].includes(ext)) cat = 'ARCHIVE';
              else if (['js','jsx','ts','py','html','css','json'].includes(ext)) cat = 'CODE';

              const newFile = {
                id: 'file-' + Date.now(),
                name: file.name,
                size: file.size,
                type: file.type || 'application/octet-stream',
                category: cat,
                updatedAt: new Date().toISOString(),
                starred: false,
                shared: false,
                url: URL.createObjectURL(file)
              };
              MOCK_FILES.unshift(newFile);
              resolve(newFile);
            } else {
              if (onProgress) onProgress(progress);
            }
          }, 200);
        });
      }
      throw error;
    }
  },

  /**
   * Rename a file
   * @param {string} fileId 
   * @param {string} newName 
   */
  renameFile: async (fileId, newName) => {
    try {
      const response = await api.put(`/files/${fileId}`, { name: newName });
      return response.data;
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        return new Promise((resolve) => {
          setTimeout(() => {
            const index = MOCK_FILES.findIndex(f => f.id === fileId);
            if (index !== -1) {
              MOCK_FILES[index].name = newName;
              MOCK_FILES[index].updatedAt = new Date().toISOString();
              resolve(MOCK_FILES[index]);
            } else {
              resolve(null);
            }
          }, 300);
        });
      }
      throw error;
    }
  },

  /**
   * Delete a file from S3 and database
   * @param {string} fileId 
   */
  deleteFile: async (fileId) => {
    try {
      const response = await api.delete(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        return new Promise((resolve) => {
          setTimeout(() => {
            MOCK_FILES = MOCK_FILES.filter(f => f.id !== fileId);
            resolve({ success: true, id: fileId });
          }, 300);
        });
      }
      throw error;
    }
  },

  /**
   * Trigger file download
   * @param {Object} file 
   */
  downloadFile: async (file) => {
    try {
      if (file.url && file.url.startsWith('http')) {
        window.open(file.url, '_blank');
        return true;
      }
      const response = await api.get(`/files/${file.id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        // Fallback simulate download
        const element = document.createElement('a');
        const fileContent = `This is a demo download content for file: ${file.name}`;
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
        element.setAttribute('download', file.name);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return true;
      }
      throw error;
    }
  }
};

export default fileService;
