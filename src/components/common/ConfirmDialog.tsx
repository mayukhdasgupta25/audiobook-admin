/**
 * Confirmation Dialog component
 */

import React from 'react';
import Modal from './Modal';
import Button from './Button';
import '../../styles/components/common/ConfirmDialog.css';

interface ConfirmDialogProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   message: string;
   confirmText?: string;
   cancelText?: string;
   variant?: 'danger' | 'warning' | 'info';
   isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
   isOpen,
   onClose,
   onConfirm,
   title,
   message,
   confirmText = 'Confirm',
   cancelText = 'Cancel',
   variant = 'danger',
   isLoading = false,
}) => {
   const handleConfirm = () => {
      onConfirm();
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose} size="small">
         <div className="confirm-dialog">
            <h3 className="confirm-dialog-title">{title}</h3>
            <p className="confirm-dialog-message">{message}</p>
            <div className="confirm-dialog-actions">
               <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  {cancelText}
               </Button>
               <Button
                  type="button"
                  variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'warning' : 'primary'}
                  onClick={handleConfirm}
                  isLoading={isLoading}
               >
                  {confirmText}
               </Button>
            </div>
         </div>
      </Modal>
   );
};

export default ConfirmDialog;

