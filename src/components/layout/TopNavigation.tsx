/**
 * Top Navigation component
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppName } from '../../utils/config';
import SearchBar from '../common/SearchBar';
import ProfileDropdown from '../common/ProfileDropdown';
import '../../styles/components/layout/TopNavigation.css';

interface TopNavigationProps {
   searchValue: string;
   onSearchChange: (value: string) => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ searchValue, onSearchChange }) => {
   const navigate = useNavigate();
   const appName = getAppName();
   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
   const profileButtonRef = useRef<HTMLButtonElement>(null);

   const handleProfileClick = () => {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
   };

   return (
      <nav className="top-navigation">
         <div className="top-nav-left">
            <h1 className="top-nav-app-name" onClick={() => navigate('/home')}>
               {appName}
            </h1>
         </div>
         <div className="top-nav-center">
            <SearchBar value={searchValue} onChange={onSearchChange} placeholder="Search..." />
         </div>
         <div className="top-nav-right">
            <button className="top-nav-icon-btn" aria-label="Notifications">
               🔔
            </button>
            <div className="profile-dropdown-wrapper">
               <button
                  ref={profileButtonRef}
                  className="top-nav-icon-btn"
                  aria-label="Profile"
                  onClick={handleProfileClick}
                  aria-expanded={isProfileDropdownOpen}
               >
                  👤
               </button>
               <ProfileDropdown
                  isOpen={isProfileDropdownOpen}
                  onClose={() => setIsProfileDropdownOpen(false)}
                  triggerRef={profileButtonRef}
               />
            </div>
         </div>
      </nav>
   );
};

export default React.memo(TopNavigation);

