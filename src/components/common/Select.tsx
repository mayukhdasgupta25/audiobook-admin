/**
 * Custom styled Select component
 */

import React from 'react';
import '../../styles/components/common/Select.css';

interface SelectOption {
   value: string;
   label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
   options: SelectOption[];
   placeholder?: string;
   error?: boolean;
   loading?: boolean;
}

const Select: React.FC<SelectProps> = ({
   options,
   placeholder = 'Select an option',
   error = false,
   loading = false,
   className = '',
   disabled,
   ...props
}) => {
   return (
      <div className={`select-wrapper ${error ? 'select-error' : ''} ${disabled ? 'select-disabled' : ''}`}>
         <select
            className={`select-input ${className}`}
            disabled={disabled || loading}
            {...props}
         >
            <option value="">{placeholder}</option>
            {options.map((option) => (
               <option key={option.value} value={option.value}>
                  {option.label}
               </option>
            ))}
         </select>
         <span className="select-arrow">▼</span>
         {loading && <span className="select-loading">Loading...</span>}
      </div>
   );
};

export default Select;

