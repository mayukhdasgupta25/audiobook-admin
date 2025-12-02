/**
 * Management page with tabbed interface for managing Genres, Tags, and Authors
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ManageTab from './components/ManageTab';
import AuthorsTab from './components/AuthorsTab';
import '../../styles/pages/management/Management.css';

type TabType = 'manage' | 'authors';

const Management: React.FC = () => {
   const [activeTab, setActiveTab] = useState<TabType>('manage');

   const tabs = [
      { id: 'manage' as TabType, label: 'Manage', icon: '⚙️' },
      { id: 'authors' as TabType, label: 'Authors', icon: '✍️' },
   ] as const;

   return (
      <div className="management-page">
         <div className="management-header">
            <h1 className="page-title">Management</h1>
            <p className="page-subtitle">Manage genres, tags, and authors</p>
         </div>

         <div className="tabs-container">
            <div className="tabs-header">
               {tabs.map((tab) => (
                  <button
                     key={tab.id}
                     className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                     onClick={() => setActiveTab(tab.id)}
                     type="button"
                  >
                     <span className="tab-icon">{tab.icon}</span>
                     <span className="tab-label">{tab.label}</span>
                  </button>
               ))}
            </div>

            <div className="tabs-content">
               <AnimatePresence mode="wait">
                  {activeTab === 'manage' && (
                     <motion.div
                        key="manage"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                     >
                        <ManageTab />
                     </motion.div>
                  )}
                  {activeTab === 'authors' && (
                     <motion.div
                        key="authors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                     >
                        <AuthorsTab />
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </div>
   );
};

export default Management;

