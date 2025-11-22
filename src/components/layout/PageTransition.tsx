/**
 * Page Transition wrapper component
 */

import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/components/layout/PageTransition.css';

interface PageTransitionProps {
   children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
         }}
         className="page-transition"
      >
         {children}
      </motion.div>
   );
};

export default PageTransition;

