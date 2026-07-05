import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FiCheck, FiX } from 'react-icons/fi';

export const RenameModal = ({ isOpen, onClose, file, onRename }) => {
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (file && file.name) {
      setNewName(file.name);
      setError('');
    }
  }, [file, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError('File name cannot be empty');
      return;
    }
    if (newName === file?.name) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await onRename(file.id, newName.trim());
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to rename file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename File">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            File Name
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter new file name..."
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            autoFocus
          />
          {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} icon={FiCheck}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RenameModal;
