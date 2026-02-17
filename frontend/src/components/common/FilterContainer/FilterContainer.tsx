import React, { useState } from 'react';
import './FilterContainer.css';

interface FilterContainerProps {
    onFilterChange: (filters: Record<string, string>) => void;
    placeholder?: string;
}

export const FilterContainer: React.FC<FilterContainerProps> = ({
    onFilterChange,
    placeholder = 'Search...',
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onFilterChange({ search: value });
    };

    const handleClear = () => {
        setSearchTerm('');
        onFilterChange({ search: '' });
    };

    return (
        <div className="filter-container">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={placeholder}
                className="filter-input"
            />
            {searchTerm && (
                <button onClick={handleClear} className="clear-button">
                    Clear
                </button>
            )}
        </div>
    );
};