import React, { useState, useEffect } from 'react';

const SearchBar = ({ value, onChange }) => {
    const [inputValue, setInputValue] = useState(value);

    // Update local state when prop changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Debounce search to avoid too many requests
    useEffect(() => {
        const handler = setTimeout(() => {
            if (inputValue !== value) {
                onChange(inputValue);
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, onChange, value]);

    return (
        <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
            <input
                type="search"
                className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Search properties, owners, addresses..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            {inputValue && (
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => {
                        setInputValue('');
                        onChange('');
                    }}
                >
                    <svg className="w-4 h-4 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;