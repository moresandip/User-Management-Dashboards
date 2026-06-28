import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

/**
 * ConfirmDelete modal prompts safety check before removing user records.
 * @param {{
 *   isOpen: boolean,
 *   userName: string,
 *   onConfirm: () => void,
 *   onClose: () => void
 * }} props
 */
export default function ConfirmDelete({ isOpen, userName, onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" role="dialog" aria-modal="true">
      <div className="glass-panel modal-content confirm-delete-content animate-slide-up">
        <div className="warning-icon-container">
          <AlertTriangle size={32} />
        </div>

        <h2 className="modal-title" style={{ textAlign: 'center', marginBottom: '1rem', background: 'none', webkitTextFillColor: 'initial', color: 'var(--text-main)' }}>
          Confirm User Deletion
        </h2>

        <p className="confirm-delete-text">
          Are you sure you want to permanently delete this user profile? This action cannot be undone.
          <span className="confirm-delete-name">{userName}</span>
        </p>

        <div className="form-actions" style={{ justifyContent: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            No, Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
          >
            <Trash2 size={16} />
            <span>Yes, Delete User</span>
          </button>
        </div>
      </div>
    </div>
  );
}
