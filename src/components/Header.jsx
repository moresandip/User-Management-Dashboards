import React from 'react';
import { Users, FolderGit2, UserPlus } from 'lucide-react';

/**
 * Header component displaying branding logo, user stats counters, and primary CTA.
 * @param {{ totalUsers: number, departmentCount: number, onAddClick: () => void }} props
 */
export default function Header({ totalUsers, departmentCount, onAddClick }) {
  return (
    <header className="glass-panel header-wrapper">
      <div className="brand-section">
        <div className="brand-icon-wrapper">
          <Users size={28} />
        </div>
        <div>
          <h1 className="brand-title">AdminSphere</h1>
          <p className="brand-subtitle">User Management Dashboard</p>
        </div>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-value">{totalUsers}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{departmentCount}</span>
          <span className="stat-label">Departments</span>
        </div>
      </div>
      
      <button className="btn btn-primary" onClick={onAddClick}>
        <UserPlus size={18} />
        <span>Add New User</span>
      </button>
    </header>
  );
}
