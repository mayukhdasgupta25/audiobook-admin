/**
 * Author form component for creating and editing authors
 */

import React, { useState, FormEvent, useEffect } from 'react';
import Button from '../../../../components/common/Button';
import '../../../../styles/pages/management/components/forms/AuthorForm.css';

interface AuthorFormData {
   firstName: string;
   lastName: string;
   email: string;
   address: string;
   contact: string;
}

interface AuthorFormProps {
   initialData?: AuthorFormData;
   onSubmit: (data: AuthorFormData) => Promise<void>;
   onCancel: () => void;
   isLoading?: boolean;
}

const AuthorForm: React.FC<AuthorFormProps> = ({
   initialData,
   onSubmit,
   onCancel,
   isLoading = false,
}) => {
   const [formData, setFormData] = useState<AuthorFormData>({
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      address: initialData?.address || '',
      contact: initialData?.contact || '',
   });

   const [errors, setErrors] = useState<Partial<Record<keyof AuthorFormData, string>>>({});

   useEffect(() => {
      if (initialData) {
         setFormData({
            firstName: initialData.firstName || '',
            lastName: initialData.lastName || '',
            email: initialData.email || '',
            address: initialData.address || '',
            contact: initialData.contact || '',
         });
      }
      setErrors({});
   }, [initialData]);

   const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
   };

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors({});

      const newErrors: Partial<Record<keyof AuthorFormData, string>> = {};

      // Validate firstName
      const trimmedFirstName = formData.firstName.trim();
      if (!trimmedFirstName) {
         newErrors.firstName = 'First name is required';
      } else if (trimmedFirstName.length < 2) {
         newErrors.firstName = 'First name must be at least 2 characters';
      } else if (trimmedFirstName.length > 50) {
         newErrors.firstName = 'First name must be less than 50 characters';
      }

      // Validate lastName
      const trimmedLastName = formData.lastName.trim();
      if (!trimmedLastName) {
         newErrors.lastName = 'Last name is required';
      } else if (trimmedLastName.length < 2) {
         newErrors.lastName = 'Last name must be at least 2 characters';
      } else if (trimmedLastName.length > 50) {
         newErrors.lastName = 'Last name must be less than 50 characters';
      }

      // Validate email
      const trimmedEmail = formData.email.trim();
      if (!trimmedEmail) {
         newErrors.email = 'Email is required';
      } else if (!validateEmail(trimmedEmail)) {
         newErrors.email = 'Please enter a valid email address';
      } else if (trimmedEmail.length > 100) {
         newErrors.email = 'Email must be less than 100 characters';
      }

      // Validate address (optional)
      if (formData.address && formData.address.trim().length > 200) {
         newErrors.address = 'Address must be less than 200 characters';
      }

      // Validate contact (optional)
      if (formData.contact && formData.contact.trim().length > 20) {
         newErrors.contact = 'Contact must be less than 20 characters';
      }

      if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors);
         return;
      }

      try {
         await onSubmit({
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            email: trimmedEmail,
            address: formData.address.trim() || '',
            contact: formData.contact.trim() || '',
         });
      } catch (err) {
         // Error handling is done in parent component
      }
   };

   const handleChange = (field: keyof AuthorFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field when user starts typing
      if (errors[field]) {
         setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
         });
      }
   };

   return (
      <form className="author-form" onSubmit={handleSubmit}>
         <div className="form-group">
            <label htmlFor="author-first-name" className="form-label">
               First Name <span className="required">*</span>
            </label>
            <input
               id="author-first-name"
               type="text"
               className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
               value={formData.firstName}
               onChange={(e) => handleChange('firstName', e.target.value)}
               placeholder="Enter first name"
               disabled={isLoading}
               autoFocus
            />
            {errors.firstName && <span className="form-error">{errors.firstName}</span>}
         </div>

         <div className="form-group">
            <label htmlFor="author-last-name" className="form-label">
               Last Name <span className="required">*</span>
            </label>
            <input
               id="author-last-name"
               type="text"
               className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
               value={formData.lastName}
               onChange={(e) => handleChange('lastName', e.target.value)}
               placeholder="Enter last name"
               disabled={isLoading}
            />
            {errors.lastName && <span className="form-error">{errors.lastName}</span>}
         </div>

         <div className="form-group">
            <label htmlFor="author-email" className="form-label">
               Email <span className="required">*</span>
            </label>
            <input
               id="author-email"
               type="email"
               className={`form-input ${errors.email ? 'form-input-error' : ''}`}
               value={formData.email}
               onChange={(e) => handleChange('email', e.target.value)}
               placeholder="Enter email address"
               disabled={isLoading}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
         </div>

         <div className="form-group">
            <label htmlFor="author-address" className="form-label">
               Address <span className="optional">(optional)</span>
            </label>
            <textarea
               id="author-address"
               className={`form-input form-textarea ${errors.address ? 'form-input-error' : ''}`}
               value={formData.address}
               onChange={(e) => handleChange('address', e.target.value)}
               placeholder="Enter address"
               disabled={isLoading}
               rows={3}
            />
            {errors.address && <span className="form-error">{errors.address}</span>}
         </div>

         <div className="form-group">
            <label htmlFor="author-contact" className="form-label">
               Contact <span className="optional">(optional)</span>
            </label>
            <input
               id="author-contact"
               type="text"
               className={`form-input ${errors.contact ? 'form-input-error' : ''}`}
               value={formData.contact}
               onChange={(e) => handleChange('contact', e.target.value)}
               placeholder="Enter contact number"
               disabled={isLoading}
            />
            {errors.contact && <span className="form-error">{errors.contact}</span>}
         </div>

         <div className="form-actions">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
               Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
               {initialData ? 'Update' : 'Create'}
            </Button>
         </div>
      </form>
   );
};

export default AuthorForm;

