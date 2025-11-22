/**
 * Profile Dropdown component
 */

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { logout as logoutAction } from '../../store/slices/authSlice';
import { logout } from '../../utils/api';
import { setAuthenticated } from '../../utils/auth';
import { showApiError } from '../../utils/toast';
import '../../styles/components/common/ProfileDropdown.css';

interface ProfileDropdownProps {
   isOpen: boolean;
   onClose: () => void;
   triggerRef: React.RefObject<HTMLButtonElement>;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose, triggerRef }) => {
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const dropdownRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            triggerRef.current &&
            !triggerRef.current.contains(event.target as Node)
         ) {
            onClose();
         }
      };

      if (isOpen) {
         document.addEventListener('mousedown', handleClickOutside);
         document.addEventListener('keydown', handleEscape);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
         document.removeEventListener('keydown', handleEscape);
      };
   }, [isOpen, onClose, triggerRef]);

   const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
         onClose();
      }
   };

   const handleLogout = async () => {
      try {
         await logout();
         dispatch(logoutAction());
         setAuthenticated(false);
         navigate('/', { replace: true });
      } catch (error) {
         showApiError(error);
         // Still logout locally even if API call fails
         dispatch(logoutAction());
         setAuthenticated(false);
         navigate('/', { replace: true });
      }
      onClose();
   };

   if (!isOpen) return null;

   return (
      <div ref={dropdownRef} className="profile-dropdown">
         <div className="profile-dropdown-item">
            <span>Profile Settings</span>
         </div>
         <div className="profile-dropdown-divider"></div>
         <button className="profile-dropdown-item profile-dropdown-logout" onClick={handleLogout}>
            <span>Logout</span>
         </button>
      </div>
   );
};

export default ProfileDropdown;

