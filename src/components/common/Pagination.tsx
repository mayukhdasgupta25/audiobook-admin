/**
 * Reusable Pagination component
 */

import React from 'react';
import '../../styles/components/common/Pagination.css';

interface PaginationProps {
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
   className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
   currentPage,
   totalPages,
   onPageChange,
   className = '',
}) => {
   if (totalPages <= 1) return null;

   const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const maxVisible = 7;

      if (totalPages <= maxVisible) {
         // Show all pages if total is less than max visible
         for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
         }
      } else {
         // Always show first page
         pages.push(1);

         if (currentPage > 3) {
            pages.push('...');
         }

         // Show pages around current page
         const start = Math.max(2, currentPage - 1);
         const end = Math.min(totalPages - 1, currentPage + 1);

         for (let i = start; i <= end; i++) {
            pages.push(i);
         }

         if (currentPage < totalPages - 2) {
            pages.push('...');
         }

         // Always show last page
         pages.push(totalPages);
      }

      return pages;
   };

   const pageNumbers = getPageNumbers();

   return (
      <div className={`pagination ${className}`}>
         <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
         >
            ‹
         </button>

         {pageNumbers.map((page, index) => {
            if (page === '...') {
               return (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                     ...
                  </span>
               );
            }

            return (
               <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => onPageChange(page as number)}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
               >
                  {page}
               </button>
            );
         })}

         <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
         >
            ›
         </button>
      </div>
   );
};

export default Pagination;

