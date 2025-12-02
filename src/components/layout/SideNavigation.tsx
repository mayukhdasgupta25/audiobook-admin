/**
 * Side Navigation component
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/components/layout/SideNavigation.css';

interface NavItem {
   label: string;
   path: string;
   icon?: string;
}

const navItems: NavItem[] = [
   { label: 'Dashboard', path: '/dashboard', icon: '📊' },
   { label: 'Audiobooks', path: '/audiobooks', icon: '📚' },
   { label: 'Management', path: '/management', icon: '⚙️' },
   { label: 'Inbox', path: '/inbox', icon: '📬' },
];

const SideNavigation: React.FC = () => {
   const navigate = useNavigate();
   const location = useLocation();

   return (
      <nav className="side-navigation">
         <ul className="side-nav-list">
            {navItems.map((item) => {
               const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
               return (
                  <li key={item.path}>
                     <button
                        className={`side-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                     >
                        {item.icon && <span className="side-nav-icon">{item.icon}</span>}
                        <span className="side-nav-label">{item.label}</span>
                     </button>
                  </li>
               );
            })}
         </ul>
      </nav>
   );
};

export default React.memo(SideNavigation);

