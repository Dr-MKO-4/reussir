import React from 'react';
import './Pagination.css';

/**
 * Props du composant Pagination
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  className?: string;
}

/**
 * Générer les numéros de page à afficher
 */
const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | string)[] => {
  const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
  const totalBlocks = totalNumbers + 2; // + 2 for ellipsis

  if (totalPages <= totalBlocks) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, '...', totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [1, '...', ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, '...', ...middleRange, '...', totalPages];
  }

  return [];
};

/**
 * Composant Pagination
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = generatePageNumbers(currentPage, totalPages, siblingCount);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const goToPrevious = () => goToPage(currentPage - 1);
  const goToNext = () => goToPage(currentPage + 1);
  const goToFirst = () => goToPage(1);
  const goToLast = () => goToPage(totalPages);

  const containerClasses = ['pagination', className].filter(Boolean).join(' ');

  return (
    <nav className={containerClasses} aria-label="Pagination">
      <ul className="pagination-list">
        {/* First Page Button */}
        {showFirstLast && (
          <li>
            <button
              className="pagination-button pagination-first"
              onClick={goToFirst}
              disabled={currentPage === 1}
              aria-label="Première page"
            >
              <svg
                className="pagination-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          </li>
        )}

        {/* Previous Button */}
        {showPrevNext && (
          <li>
            <button
              className="pagination-button pagination-prev"
              onClick={goToPrevious}
              disabled={currentPage === 1}
              aria-label="Page précédente"
            >
              <svg
                className="pagination-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </li>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === '...') {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="pagination-ellipsis" aria-hidden="true">
                  ...
                </span>
              </li>
            );
          }

          const page = pageNumber as number;
          const isActive = page === currentPage;

          return (
            <li key={page}>
              <button
                className={`pagination-button pagination-number ${
                  isActive ? 'pagination-active' : ''
                }`}
                onClick={() => goToPage(page)}
                aria-label={`Page ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* Next Button */}
        {showPrevNext && (
          <li>
            <button
              className="pagination-button pagination-next"
              onClick={goToNext}
              disabled={currentPage === totalPages}
              aria-label="Page suivante"
            >
              <svg
                className="pagination-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </li>
        )}

        {/* Last Page Button */}
        {showFirstLast && (
          <li>
            <button
              className="pagination-button pagination-last"
              onClick={goToLast}
              disabled={currentPage === totalPages}
              aria-label="Dernière page"
            >
              <svg
                className="pagination-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </li>
        )}
      </ul>

      {/* Page Info */}
      <div className="pagination-info" aria-live="polite">
        Page {currentPage} sur {totalPages}
      </div>
    </nav>
  );
};

Pagination.displayName = 'Pagination';

export default Pagination;