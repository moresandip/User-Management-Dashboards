import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Users } from 'lucide-react';
import UserRow from './UserRow';

/**
 * UserTable renders the complete grid container, headers with bidirectional sorting, and empty state handles.
 * @param {{
 *   users: Array<any>,
 *   sortField: string,
 *   sortOrder: 'asc' | 'desc',
 *   onSort: (field: string) => void,
 *   onEdit: (u: any) => void,
 *   onDelete: (id: number) => void
 * }} props
 */
export default function UserTable({
  users,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete
}) {
  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp size={14} style={{ color: 'var(--accent-cyan)' }} />
      : <ArrowDown size={14} style={{ color: 'var(--accent-cyan)' }} />;
  };

  const headers = [
    { label: 'ID', sortable: false },
    { label: 'First Name', sortable: true, field: 'firstName' },
    { label: 'Last Name', sortable: true, field: 'lastName' },
    { label: 'Email', sortable: true, field: 'email' },
    { label: 'Department', sortable: true, field: 'department' },
    { label: 'Actions', sortable: false }
  ];

  return (
    <div className="table-container">
      {users.length === 0 ? (
        <div className="table-empty-state">
          <Users size={48} className="empty-state-icon" />
          <h3>No users found</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Try adjusting your search filters or add a new user.
          </p>
        </div>
      ) : (
        <table className="responsive-table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>
                  {h.sortable ? (
                    <div 
                      className="sortable-header" 
                      onClick={() => onSort(h.field)}
                    >
                      <span>{h.label}</span>
                      {renderSortIcon(h.field)}
                    </div>
                  ) : (
                    <span>{h.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <UserRow
                key={user.id}
                user={user}
                onEditClick={onEdit}
                onDeleteClick={onDelete}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
