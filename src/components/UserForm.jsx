import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { DEPARTMENTS } from '../utils/constants';
import { validateForm } from '../utils/validators';

/**
 * UserForm modal for CRUD create and update operations, highlighting input warnings on validation failures.
 * @param {{
 *   isOpen: boolean,
 *   user: any | null,
 *   onSubmit: (formData: any) => Promise<boolean>,
 *   onClose: () => void
 * }} props
 */
export default function UserForm({ isOpen, user, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if form edits an existing user or opens freshly
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          department: user.department || ''
        });
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          department: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error dynamically on keystroke
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit(formData);
    setIsSubmitting(false);
    
    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" role="dialog" aria-modal="true">
      <div className="glass-panel modal-content animate-slide-up">
        <div className="modal-header">
          <h2 className="modal-title">
            {user ? 'Update User Details' : 'Create New User Profile'}
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close form modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Enter first name"
              disabled={isSubmitting}
            />
            {errors.firstName && (
              <span className="form-error-msg">
                <AlertCircle size={14} />
                {errors.firstName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Enter last name"
              disabled={isSubmitting}
            />
            {errors.lastName && (
              <span className="form-error-msg">
                <AlertCircle size={14} />
                {errors.lastName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g. employee@company.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="form-error-msg">
                <AlertCircle size={14} />
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="department">Department</label>
            <select
              id="department"
              className={`form-input ${errors.department ? 'form-input-error' : ''}`}
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <span className="form-error-msg">
                <AlertCircle size={14} />
                {errors.department}
              </span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : user ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
