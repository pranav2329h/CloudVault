import { useState, useCallback, useEffect } from 'react';
import fileService from '../services/fileService';
import toast from 'react-hot-toast';

export const useFiles = (initialParams = {}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1
  });
  const [params, setParams] = useState({
    search: '',
    category: 'ALL',
    sort: 'updatedAt',
    order: 'desc',
    page: 1,
    limit: 12,
    ...initialParams
  });

  const fetchFiles = useCallback(async (customParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const mergedParams = { ...params, ...customParams };
      const data = await fileService.getFiles(mergedParams);
      setFiles(data.files || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load files.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const uploadFile = async (file, onProgress) => {
    try {
      const uploaded = await fileService.uploadFile(file, onProgress);
      toast.success(`"${file.name}" uploaded successfully!`);
      // Refresh list
      fetchFiles();
      return uploaded;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || `Failed to upload "${file.name}".`;
      toast.error(msg);
      throw err;
    }
  };

  const renameFile = async (fileId, newName) => {
    try {
      const updated = await fileService.renameFile(fileId, newName);
      toast.success('File renamed successfully');
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName } : f));
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to rename file.';
      toast.error(msg);
      throw err;
    }
  };

  const deleteFile = async (fileId, fileName) => {
    try {
      await fileService.deleteFile(fileId);
      toast.success(`"${fileName || 'File'}" deleted`);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete file.';
      toast.error(msg);
      throw err;
    }
  };

  const downloadFile = async (file) => {
    const toastId = toast.loading(`Preparing download for "${file.name}"...`);
    try {
      await fileService.downloadFile(file);
      toast.success('Download started!', { id: toastId });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Download failed.';
      toast.error(msg, { id: toastId });
    }
  };

  return {
    files,
    loading,
    error,
    pagination,
    params,
    updateParams,
    refreshFiles: fetchFiles,
    uploadFile,
    renameFile,
    deleteFile,
    downloadFile
  };
};

export default useFiles;
