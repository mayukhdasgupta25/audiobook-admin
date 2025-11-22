/**
 * Loading Spinner component
 */

import React from 'react';
import '../../styles/components/common/LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
   return (
      <div className="loading-spinner">
         <div className="spinner"></div>
      </div>
   );
};

export default LoadingSpinner;

