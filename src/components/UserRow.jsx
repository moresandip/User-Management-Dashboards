import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

/**
 * UserRow displays individual attributes and trigger handlers for edit/delete events.
 * @param {{
 *   user: { id: number, firstName: string, lastName: string, email: string, department: string },
 *   onEditClick: (u: any) => void,
 *   onDeleteClick: (id: number) => void
 * }} props
 */
export default function UserRow({ user, onEditClick, onDeleteClick }) {
  const getDeptBadgeClass = (dept) => {
    switch (dept) {
      case 'Engineering': return 'badge-cyan';
      case 'Product': return 'badge-purple';
      case 'Design': return 'badge-emerald';
      case 'Marketing': return 'badge-amber';
      default: return 'badge-rose';
    }
  };

  return (
    <tr>
      <td className="user-id-col">#{user.id}</td>
      <td className="user-name-col">{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>
        <a href={`mailto:${user.email}`} className="user-email-col">
          {user.email}
        </a>
      </td>
      <td>
        <span className={`badge ${getDeptBadgeClass(user.department)}`}>
          {user.department}
        </span>
      </td>
      <td>
        <div className="actions-cell">
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => onEditClick(user)}
            title="Edit User"
            aria-label={`Edit user ${user.firstName} ${user.lastName}`}
          >
            <Edit size={16} />
          </button>
          <button
            className="btn btn-danger btn-icon"
            onClick={() => onDeleteClick(user.id)}
            title="Delete User"
            aria-label={`Delete user ${user.firstName} ${user.lastName}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
