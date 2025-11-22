/**
 * Reusable SearchBar component
 */

import React from 'react';
import '../../styles/components/common/SearchBar.css';

interface SearchBarProps {
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
   className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
   value,
   onChange,
   placeholder = 'Search...',
   className = '',
}) => {
   return (
      <div className={`search-bar ${className}`}>
         <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="search-input"
         />
         <span className="search-icon">🔍</span>
      </div>
   );
};

export default SearchBar;

