import React from 'react';
import { Search, Filter } from 'lucide-react';
import { PAGE_LIMITS } from '../utils/constants';

/**
 * SearchBar component with input query field, filter popup trigger, and page limit options.
 * @param {{
 *   searchText: string,
 *   onSearchChange: (val: string) => void,
 *   pageSize: number,
 *   onPageSizeChange: (size: number) => void,
 *   filterCount: number,
 *   onToggleFilters: () => void,
 *   isFilterOpen: boolean
 * }} props
 */
export default function SearchBar({
  searchText,
  onSearchChange,
  pageSize,
  onPageSizeChange,
  filterCount,
  onToggleFilters,
  isFilterOpen
}) {
  return (
    <div className="glass-panel actions-bar">
      <div className="search-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search by first name, last name, or email..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-actions">
        <button 
          className={`btn ${filterCount > 0 || isFilterOpen ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onToggleFilters}
        >
          <Filter size={18} />
          <span>Filters</span>
          {filterCount > 0 && (
            <span className="badge badge-rose" style={{ marginLeft: '4px', padding: '1px 6px', fontSize: '10px' }}>
              {filterCount}
            </span>
          )}
        </button>

        <div className="limit-select-wrapper">
          <span>Show:</span>
          <select 
            className="select-input"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {PAGE_LIMITS.map(limit => (
              <option key={limit} value={limit}>{limit}</option>
            ))}
          </select>
          <span>per page</span>
        </div>
      </div>
    </div>
  );
}
