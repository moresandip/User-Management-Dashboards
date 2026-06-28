import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination component with active window calculations, disabled boundaries, and numeric selectors.
 * @param {{
 *   currentPage: number,
 *   totalCount: number,
 *   pageSize: number,
 *   onPageChange: (page: number) => void
 * }} props
 */
export default function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? 'page-btn-active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(totalCount, currentPage * pageSize);

  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        Showing <strong>{startRecord}-{endRecord}</strong> of <strong>{totalCount}</strong> users
      </div>

      <div className="pagination-controls">
        <button
          className="page-btn"
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {renderPageButtons()}

        <button
          className="page-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
