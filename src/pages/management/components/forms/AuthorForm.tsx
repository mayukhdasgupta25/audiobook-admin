/**
 * Author form component for creating and editing authors
 */

import React, { useState, FormEvent, useEffect } from 'react';
import Button from '../../../../components/common/Button';
import '../../../../styles/pages/management/components/forms/AuthorForm.css';

interface AuthorFormData {
  firstName: string;
  lastName: string;
  userId: string;
  address: string;
  contact: string;
}

interface AuthorFormProps {
  initialData?: {
    firstName?: string | null;
    lastName?: string | null;
    userId?: string;
    address?: string | null;
    contact?: string | null;
  };
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
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    userId: initialData?.userId || '',
    address: initialData?.address || '',
    contact: initialData?.contact || '',
  });
  const isEditing = Boolean(initialData);

  const [errors, setErrors] = useState<
    Partial<Record<keyof AuthorFormData, string>>
  >({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        userId: initialData.userId || '',
        address: initialData.address || '',
        contact: initialData.contact || '',
      });
    }
    setErrors({});
  }, [initialData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Partial<Record<keyof AuthorFormData, string>> = {};

    const trimmedFirstName = formData.firstName.trim();
    if (!trimmedFirstName) {
      newErrors.firstName = 'First name is required';
    }

    const trimmedLastName = formData.lastName.trim();
    if (!trimmedLastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!isEditing) {
      const trimmedUserId = formData.userId.trim();
      if (!trimmedUserId) {
        newErrors.userId = 'User ID is required for author creation';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      userId: formData.userId.trim(),
      address: formData.address.trim(),
      contact: formData.contact.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="author-form">
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          value={formData.firstName}
          onChange={e => {
            setFormData({ ...formData, firstName: e.target.value });
            setErrors({ ...errors, firstName: '' });
          }}
          placeholder="Enter first name"
          className={errors.firstName ? 'input-error' : ''}
          disabled={isLoading}
        />
        {errors.firstName && (
          <span className="error-message">{errors.firstName}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          value={formData.lastName}
          onChange={e => {
            setFormData({ ...formData, lastName: e.target.value });
            setErrors({ ...errors, lastName: '' });
          }}
          placeholder="Enter last name"
          className={errors.lastName ? 'input-error' : ''}
          disabled={isLoading}
        />
        {errors.lastName && (
          <span className="error-message">{errors.lastName}</span>
        )}
      </div>

      {!isEditing && (
        <div className="form-group">
          <label htmlFor="userId">User ID</label>
          <input
            id="userId"
            type="text"
            value={formData.userId}
            onChange={e => {
              setFormData({ ...formData, userId: e.target.value });
              setErrors({ ...errors, userId: '' });
            }}
            placeholder="Existing AUTHOR user ID"
            className={errors.userId ? 'input-error' : ''}
            disabled={isLoading}
          />
          {errors.userId && (
            <span className="error-message">{errors.userId}</span>
          )}
          <p className="form-hint">
            The user must already be registered with the AUTHOR role.
          </p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          value={formData.address}
          onChange={e => {
            setFormData({ ...formData, address: e.target.value });
            setErrors({ ...errors, address: '' });
          }}
          placeholder="Enter address"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="contact">Contact</label>
        <input
          id="contact"
          type="text"
          value={formData.contact}
          onChange={e => {
            setFormData({ ...formData, contact: e.target.value });
            setErrors({ ...errors, contact: '' });
          }}
          placeholder="Enter contact number"
          disabled={isLoading}
        />
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {isEditing ? 'Update Author' : 'Create Author'}
        </Button>
      </div>
    </form>
  );
};

export default AuthorForm;
