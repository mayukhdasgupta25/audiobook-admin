/**
 * Reusable Button component
 */

import React from 'react';
import '../../styles/components/common/Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'warning';
   size?: 'small' | 'medium' | 'large';
   isLoading?: boolean;
   children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
   variant = 'primary',
   size = 'medium',
   isLoading = false,
   children,
   className = '',
   disabled,
   ...props
}) => {
   return (
      <button
         className={`btn btn-${variant} btn-${size} ${className}`}
         disabled={disabled || isLoading}
         {...props}
      >
         {isLoading ? 'Loading...' : children}
      </button>
   );
};

export default Button;

