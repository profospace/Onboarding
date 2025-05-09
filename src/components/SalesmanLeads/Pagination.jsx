import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPages = 5; // Maximum number of page buttons to show

        if (totalPages <= maxPages) {
            // If total pages is less than or equal to maxPages, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include first page
            pages.push(1);

            // Calculate start and end of page range around current page
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust range if at the boundaries
            if (currentPage <= 2) {
                end = Math.min(totalPages - 1, 4);
            } else if (currentPage >= totalPages - 1) {
                start = Math.max(2, totalPages - 3);
            }

            // Add ellipsis before middle pages if needed
            if (start > 2) {
                pages.push('...');
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis after middle pages if needed
            if (end < totalPages - 1) {
                pages.push('...');
            }

            // Always include last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // Don't render if there's only 1 page
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-1" aria-label="Pagination">
                {/* Previous page button */}
                <button
                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-200 transition-colors'
                        }`}
                >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-3 py-2">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page)}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-200 transition-colors'
                                    }`}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}

                {/* Next page button */}
                <button
                    onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-200 transition-colors'
                        }`}
                >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </nav>
        </div>
    );
};

export default Pagination;