import React, { useState, useMemo } from 'react';
import useUsers from './hooks/useUsers';

// Import CSS stylesheets
import './styles/main.css';
import './styles/glassmorphism.css';
import './styles/components.css';

// Import icons
import { 
  Users, 
  RotateCw, 
  Plus, 
  X, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

// Import components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterPopup from './components/FilterPopup';
import UserTable from './components/UserTable';
import Pagination from './components/Pagination';
import UserForm from './components/UserForm';
import ConfirmDelete from './components/ConfirmDelete';

export default function App() {
  const {
    users,
    isLoading,
    error,
    successMessage,
    setError,
    setSuccessMessage,
    fetchUsers,
    addUser,
    editUser,
    removeUser
  } = useUsers();

  // Search, Filter, Sort and Pagination State
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });

  const [sortField, setSortField] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modals & Dialog Visibility State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Clear a specific filter value
  const handleRemoveFilterBadge = (field) => {
    setAppliedFilters(prev => {
      const updated = { ...prev, [field]: '' };
      setCurrentPage(1); // Reset page on filter update
      return updated;
    });
  };

  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
    setCurrentPage(1); // Reset page on filter update
  };

  const handleClearFilters = () => {
    setAppliedFilters({
      firstName: '',
      lastName: '',
      email: '',
      department: ''
    });
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchText(val);
    setCurrentPage(1); // Reset page on search
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to page 1 to prevent empty window boundaries
  };

  // Active filter count logic
  const activeFilterCount = useMemo(() => {
    return Object.values(appliedFilters).filter(val => val !== '').length;
  }, [appliedFilters]);

  // Derived filter and search logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // 1. Text Search matching First Name, Last Name, or Email
      if (searchText) {
        const query = searchText.toLowerCase();
        const matchesQuery = 
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // 2. Granular filters matching individual fields
      if (appliedFilters.firstName && !user.firstName.toLowerCase().includes(appliedFilters.firstName.toLowerCase())) {
        return false;
      }
      if (appliedFilters.lastName && !user.lastName.toLowerCase().includes(appliedFilters.lastName.toLowerCase())) {
        return false;
      }
      if (appliedFilters.email && !user.email.toLowerCase().includes(appliedFilters.email.toLowerCase())) {
        return false;
      }
      if (appliedFilters.department && user.department !== appliedFilters.department) {
        return false;
      }

      return true;
    });
  }, [users, searchText, appliedFilters]);

  // Bidirectional Sorting logic
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortField === 'id') {
        return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      }

      const valA = a[sortField] ? a[sortField].toString().toLowerCase() : '';
      const valB = b[sortField] ? b[sortField].toString().toLowerCase() : '';

      return sortOrder === 'asc' 
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }, [filteredUsers, sortField, sortOrder]);

  // Pagination Splitting Math
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedUsers.slice(startIndex, startIndex + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  // Total unique departments represented
  const departmentCount = useMemo(() => {
    const depts = users.map(u => u.department);
    return new Set(depts).size;
  }, [users]);

  // Handling header sorting clicks
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Triggering form triggers
  const handleAddClick = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  // Form submission callback
  const handleFormSubmit = async (formData) => {
    if (editingUser) {
      return await editUser(editingUser.id, formData);
    } else {
      return await addUser(formData);
    }
  };

  // Deletion confirmation callback
  const handleConfirmDelete = async () => {
    if (deletingId) {
      const success = await removeUser(deletingId);
      if (success) {
        setIsDeleteOpen(false);
        setDeletingId(null);
        // Adjust pagination boundary if deleting last element of the page
        const newTotalCount = filteredUsers.length - 1;
        const totalPages = Math.ceil(newTotalCount / pageSize);
        if (currentPage > totalPages && currentPage > 1) {
          setCurrentPage(totalPages);
        }
      }
    }
  };

  // Render filter badges under the search bar for active filters
  const renderActiveFilterBadges = () => {
    if (activeFilterCount === 0) return null;
    
    return (
      <div className="filter-badge-list animate-fade-in" style={{ padding: '0 1.25rem 1rem 1.25rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.25rem' }}>
          Active Filters:
        </span>
        {Object.entries(appliedFilters).map(([field, value]) => {
          if (!value) return null;
          const displayLabel = field === 'firstName' ? 'First Name' : field === 'lastName' ? 'Last Name' : field === 'email' ? 'Email' : 'Dept';
          return (
            <span key={field} className="filter-badge-item">
              <span>{displayLabel}: <strong>{value}</strong></span>
              <button 
                className="filter-badge-remove" 
                onClick={() => handleRemoveFilterBadge(field)}
                aria-label={`Remove filter ${displayLabel}`}
              >
                <X size={12} />
              </button>
            </span>
          );
        })}
        <button 
          className="btn btn-secondary"
          onClick={handleClearFilters}
          style={{ minHeight: '24px', height: '24px', padding: '0 0.5rem', fontSize: '10px', borderRadius: '4px' }}
        >
          Clear All
        </button>
      </div>
    );
  };

  const deletingUserName = useMemo(() => {
    if (!deletingId) return '';
    const user = users.find(u => u.id === deletingId);
    return user ? `${user.firstName} ${user.lastName}` : '';
  }, [deletingId, users]);

  return (
    <div className="app-container">
      {/* Branding and Actions Header */}
      <Header
        totalUsers={users.length}
        departmentCount={departmentCount}
        onAddClick={handleAddClick}
      />

      {/* Main Table Panel */}
      <main className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
        {/* Search, page controls, and filters */}
        <div style={{ position: 'relative', overflow: 'visible' }}>
          <SearchBar
            searchText={searchText}
            onSearchChange={handleSearchChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            filterCount={activeFilterCount}
            onToggleFilters={() => setIsFilterOpen(prev => !prev)}
            isFilterOpen={isFilterOpen}
          />

          {isFilterOpen && (
            <FilterPopup
              filters={appliedFilters}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              onClose={() => setIsFilterOpen(false)}
            />
          )}
        </div>

        {/* Dynamic active filter summary tags */}
        {renderActiveFilterBadges()}

        {/* Global Error Banner */}
        {error && (
          <div className="glass-panel error-fallback-panel animate-fade-in" style={{ margin: '1rem 1.25rem', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
            <div className="error-fallback-title">System Error Alert</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
            <button className="btn btn-secondary" onClick={() => fetchUsers()} style={{ minHeight: '38px', padding: '0.4rem 1rem' }}>
              <RotateCw size={14} style={{ marginRight: '6px' }} />
              Retry Fetch
            </button>
          </div>
        )}

        {/* List Loading Overlay or Main Grid View */}
        {isLoading && users.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem' }}>
            <div className="spinner"></div>
            <span style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Syncing user database...
            </span>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {isLoading && (
              <div className="animate-fade-in" style={{ position: 'absolute', inset: 0, background: 'rgba(2, 6, 23, 0.4)', backdropFilter: 'blur(3px)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner"></div>
              </div>
            )}
            
            <UserTable
              users={paginatedUsers}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>
        )}

        {/* Footnotes controls */}
        {!isLoading && users.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalCount={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </main>

      {/* Popups Forms (Add / Edit Profile) */}
      <UserForm
        isOpen={isFormOpen}
        user={editingUser}
        onSubmit={handleFormSubmit}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
      />

      {/* Safety confirmations modal */}
      <ConfirmDelete
        isOpen={isDeleteOpen}
        userName={deletingUserName}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingId(null);
        }}
      />

      {/* Floating alert notifications */}
      {successMessage && (
        <div className="notification-banner notification-success animate-slide-in-right" role="alert">
          <CheckCircle size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{successMessage}</span>
          <button 
            className="notification-close" 
            onClick={() => setSuccessMessage(null)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
