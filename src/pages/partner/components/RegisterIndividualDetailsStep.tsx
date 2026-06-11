import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Mail, MapPin, Phone, Star, User } from 'lucide-react';
import Button from '../../../components/common/Button';
import FieldErrorHint from '../../../components/common/FieldErrorHint';
import InfoBanner from '../../../components/common/InfoBanner';
import ImageUploadZone from '../../../components/common/ImageUploadZone';
import IndividualProfilePreview from '../../../components/common/IndividualProfilePreview';
import type { IndividualDetailsData } from '../../../store/slices/partnerRegistrationSlice';
import { validateEmail } from '../../../utils/validation';

export interface RegisterIndividualDetailsData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  contact: string;
  image: File | null;
}

interface RegisterIndividualDetailsStepProps {
  isLoading: boolean;
  initialData?: IndividualDetailsData;
  onSubmit: (data: RegisterIndividualDetailsData) => void;
  onBack?: (draft: IndividualDetailsData) => void;
}

function RegisterIndividualDetailsStep({
  isLoading,
  initialData,
  onSubmit,
  onBack,
}: RegisterIndividualDetailsStepProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName ?? '');
  const [lastName, setLastName] = useState(initialData?.lastName ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [address, setAddress] = useState(initialData?.address ?? '');
  const [contact, setContact] = useState(initialData?.contact ?? '');
  const [image, setImage] = useState<File | null>(initialData?.image ?? null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const photoPreviewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image]
  );

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  useEffect(() => {
    setFirstName(initialData?.firstName ?? '');
    setLastName(initialData?.lastName ?? '');
    setEmail(initialData?.email ?? '');
    setAddress(initialData?.address ?? '');
    setContact(initialData?.contact ?? '');
    setImage(initialData?.image ?? null);
  }, [initialData]);

  const fullName = `${firstName} ${lastName}`.trim();

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const buildDraft = (): IndividualDetailsData => ({
    firstName,
    lastName,
    email,
    address,
    contact,
    image,
  });

  const handleBack = () => {
    onBack?.(buildDraft());
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedAddress = address.trim();
    const trimmedContact = contact.trim();
    const errors: Record<string, string> = {};

    if (!trimmedFirstName || trimmedFirstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!trimmedLastName || trimmedLastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!trimmedAddress) {
      errors.address = 'Please enter an address';
    } else if (trimmedAddress.length > 200) {
      errors.address = 'Address must be less than 200 characters';
    }

    if (!trimmedContact) {
      errors.contact = 'Please enter a contact number';
    } else if (trimmedContact.length > 20) {
      errors.contact = 'Contact must be less than 20 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    onSubmit({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      address: trimmedAddress,
      contact: trimmedContact,
      image,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="partner-register-form">
      <div className="partner-account-badge-row">
        <span className="partner-account-badge form-highlight-surface">
          <Star size={14} />
          Individual account
        </span>
      </div>

      <h2 className="partner-form-section-title">Create your personal profile</h2>
      <InfoBanner>
        This information will be visible in your partner workspace. You can
        update it anytime.
      </InfoBanner>

      <div className="individual-profile-grid">
        <div className="individual-profile-fields">
          <div className="partner-form-group">
            <label htmlFor="individualFirstName" className="partner-field-label">
              First name
              <FieldErrorHint message={fieldErrors.firstName} />
            </label>
            <div className="partner-input-with-icon">
              <User size={18} className="partner-input-icon" />
              <input
                id="individualFirstName"
                type="text"
                className={fieldErrors.firstName ? 'partner-input--error' : ''}
                value={firstName}
                onChange={e => {
                  setFirstName(e.target.value);
                  clearFieldError('firstName');
                }}
                placeholder="Enter your first name"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="partner-form-group">
            <label htmlFor="individualLastName" className="partner-field-label">
              Last name
              <FieldErrorHint message={fieldErrors.lastName} />
            </label>
            <div className="partner-input-with-icon">
              <User size={18} className="partner-input-icon" />
              <input
                id="individualLastName"
                type="text"
                className={fieldErrors.lastName ? 'partner-input--error' : ''}
                value={lastName}
                onChange={e => {
                  setLastName(e.target.value);
                  clearFieldError('lastName');
                }}
                placeholder="Enter your last name"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="partner-form-group">
            <label htmlFor="individualEmail" className="partner-field-label">
              Email
              <FieldErrorHint message={fieldErrors.email} />
            </label>
            <div className="partner-input-with-icon">
              <Mail size={18} className="partner-input-icon" />
              <input
                id="individualEmail"
                type="email"
                className={fieldErrors.email ? 'partner-input--error' : ''}
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="partner-form-group">
            <label htmlFor="individualAddress" className="partner-field-label">
              Address
              <FieldErrorHint message={fieldErrors.address} />
            </label>
            <div className="partner-input-with-icon">
              <MapPin size={18} className="partner-input-icon" />
              <input
                id="individualAddress"
                type="text"
                className={fieldErrors.address ? 'partner-input--error' : ''}
                value={address}
                onChange={e => {
                  setAddress(e.target.value);
                  clearFieldError('address');
                }}
                placeholder="Enter your address"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="partner-form-group">
            <label htmlFor="individualContact" className="partner-field-label">
              Contact number
              <FieldErrorHint message={fieldErrors.contact} />
            </label>
            <div className="partner-input-with-icon">
              <Phone size={18} className="partner-input-icon" />
              <input
                id="individualContact"
                type="text"
                className={fieldErrors.contact ? 'partner-input--error' : ''}
                value={contact}
                onChange={e => {
                  setContact(e.target.value);
                  clearFieldError('contact');
                }}
                placeholder="Enter your contact number"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="individual-profile-media">
          <ImageUploadZone
            value={image}
            onChange={setImage}
            disabled={isLoading}
            previewUrl={photoPreviewUrl}
            compact
          />
          <IndividualProfilePreview
            fullName={fullName}
            photoPreviewUrl={photoPreviewUrl}
            compact
          />
        </div>
      </div>

      <div className="partner-wizard-footer">
        {onBack && (
          <button
            type="button"
            className="partner-back-link"
            onClick={handleBack}
            disabled={isLoading}
          >
            Back
          </button>
        )}
        <Button type="submit" className="partner-continue-btn" isLoading={isLoading}>
          Continue
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}

export default RegisterIndividualDetailsStep;
