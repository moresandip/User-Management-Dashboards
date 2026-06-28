import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { DEPARTMENTS } from '../utils/constants';

/**
 * FilterPopup overlay allowing granular exclusions by name, email suffix, and department.
 * @param {{
 *   filters: { firstName: string, lastName: string, email: string, department: string },
 *   onApplyFilters: (f: any) => void,
 *   onClearFilters: () => void,
 *   onClose: () => void
 * }} props
 */
export default function FilterPopup({
  filters,
  onApplyFilters,
  onClearFilters,
  onClose
}) {
  const [localFilters, setLocalFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });

  // Prepopulate local state when popup opens
  useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters]);

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    onClearFilters();
    onClose();
  };

  return (
    <div className="glass-panel filter-popup-container animate-slide-up">
      <div className="filter-popup-header">
        <span>Granular Filter Options</span>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close filters">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleApply}>
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-input"
            value={localFilters.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="e.g. Leanne"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-input"
            value={localFilters.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="e.g. Graham"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Contains</label>
          <input
            type="text"
            className="form-input"
            value={localFilters.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="e.g. Sincere@ or .biz"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Department</label>
          <select
            className="form-input"
            value={localFilters.department}
            onChange={(e) => handleChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="filter-popup-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
            style={{ minHeight: '38px', padding: '0.4rem 1rem' }}
          >
            Clear All
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ minHeight: '38px', padding: '0.4rem 1rem' }}
          >
            <Check size={16} />
            <span>Apply</span>
          </button>
        </div>
      </form>
    </div>
  );
}
