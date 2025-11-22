/**
 * Reusable Modal component
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/components/common/Modal.css';

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   title?: string;
   children: React.ReactNode;
   size?: 'small' | 'medium' | 'large';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'medium' }) => {
   useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === 'Escape' && isOpen) {
            onClose();
         }
      };

      if (isOpen) {
         document.addEventListener('keydown', handleEscape);
         document.body.style.overflow = 'hidden';
      }

      return () => {
         document.removeEventListener('keydown', handleEscape);
         document.body.style.overflow = 'unset';
      };
   }, [isOpen, onClose]);

   return (
      <AnimatePresence>
         {isOpen && (
            <motion.div
               className="modal-overlay"
               onClick={onClose}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.2 }}
            >
               <motion.div
                  className={`modal-content modal-${size}`}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{
                     duration: 0.2,
                     ease: [0.22, 1, 0.36, 1],
                  }}
               >
                  {title && (
                     <div className="modal-header">
                        <h2 className="modal-title">{title}</h2>
                        <button className="modal-close" onClick={onClose} aria-label="Close">
                           ×
                        </button>
                     </div>
                  )}
                  <div className="modal-body">{children}</div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
   );
};

export default Modal;

