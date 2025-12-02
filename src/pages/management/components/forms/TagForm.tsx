/**
 * Tag form component for creating and editing tags
 */

import React, { useState, FormEvent, useEffect } from 'react';
import Button from '../../../../components/common/Button';
import '../../../../styles/pages/management/components/forms/TagForm.css';

interface TagFormProps {
   initialName?: string;
   onSubmit: (name: string) => Promise<void>;
   onCancel: () => void;
   isLoading?: boolean;
}

const TagForm: React.FC<TagFormProps> = ({
   initialName = '',
   onSubmit,
   onCancel,
   isLoading = false,
}) => {
   const [name, setName] = useState(initialName);
   const [error, setError] = useState<string>('');

   useEffect(() => {
      setName(initialName);
      setError('');
   }, [initialName]);

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');

      // Validation
      const trimmedName = name.trim();
      if (!trimmedName) {
         setError('Tag name is required');
         return;
      }

      if (trimmedName.length < 2) {
         setError('Tag name must be at least 2 characters');
         return;
      }

      if (trimmedName.length > 50) {
         setError('Tag name must be less than 50 characters');
         return;
      }

      try {
         await onSubmit(trimmedName);
      } catch (err) {
         // Error handling is done in parent component
      }
   };

   return (
      <form className="tag-form" onSubmit={handleSubmit}>
         <div className="form-group">
            <label htmlFor="tag-name" className="form-label">
               Tag Name <span className="required">*</span>
            </label>
            <input
               id="tag-name"
               type="text"
               className={`form-input ${error ? 'form-input-error' : ''}`}
               value={name}
               onChange={(e) => {
                  setName(e.target.value);
                  setError('');
               }}
               placeholder="Enter tag name"
               disabled={isLoading}
               autoFocus
            />
         </div>

         {error && <span className="form-error">{error}</span>}

         <div className="form-actions">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
               Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
               {initialName ? 'Update' : 'Create'}
            </Button>
         </div>
      </form>
   );
};

export default TagForm;

