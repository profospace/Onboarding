import React from 'react';

const NoResultsFound = ({ search, hasFilters }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            {search && (
                <p className="text-gray-600 mb-1">
                    No results for "<span className="font-medium">{search}</span>"
                </p>
            )}
            {hasFilters && (
                <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search criteria
                </p>
            )}
            {!search && !hasFilters && (
                <p className="text-gray-600 mb-4">
                    You haven't created any leads yet
                </p>
            )}
            <a
                href="/create-lead"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Create New Lead
            </a>
        </div>
    );
};

export default NoResultsFound;