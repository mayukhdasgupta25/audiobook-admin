import { FormEvent, useState } from 'react';

import {

  ArrowRight,

  Building2,

  Eye,

  EyeOff,

  Lock,

  Mail,

  MapPin,

  Phone,

  Shield,

} from 'lucide-react';

import Button from '../../../components/common/Button';

import FieldErrorHint from '../../../components/common/FieldErrorHint';

import InfoBanner from '../../../components/common/InfoBanner';

import PasswordStrengthIndicator from '../../../components/common/PasswordStrengthIndicator';

import type { OrganizationAccountData } from '../../../store/slices/partnerRegistrationSlice';

import { validateEmail } from '../../../utils/validation';

import { isPasswordStrongEnough } from '../../../utils/passwordStrength';



export interface RegisterUserFormData {

  email: string;

  password: string;

  confirmPassword: string;

  address: string;

  contact: string;

  acceptedTerms: boolean;

}



interface RegisterUserStepProps {

  isLoading: boolean;

  initialData?: OrganizationAccountData;

  onSubmit: (data: RegisterUserFormData) => void;

  onBack?: () => void;

}



function RegisterUserStep({

  isLoading,

  initialData,

  onSubmit,

  onBack,

}: RegisterUserStepProps) {

  const [email, setEmail] = useState(initialData?.email ?? '');

  const [password, setPassword] = useState(initialData?.password ?? '');

  const [address, setAddress] = useState(initialData?.address ?? '');

  const [contact, setContact] = useState(initialData?.contact ?? '');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(

    initialData?.acceptedTerms ?? false

  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});



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



  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const errors: Record<string, string> = {};



    if (!validateEmail(email)) {

      errors.email = 'Please enter a valid work email address';

    }



    if (!isPasswordStrongEnough(password)) {

      errors.password = 'Please create a stronger password';

    }



    if (password !== confirmPassword) {

      errors.confirmPassword = 'Passwords do not match';

    }



    const trimmedAddress = address.trim();

    const trimmedContact = contact.trim();



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



    if (!acceptedTerms) {

      errors.acceptedTerms = 'You must agree to the Terms and Privacy Policy';

    }



    if (Object.keys(errors).length > 0) {

      setFieldErrors(errors);

      return;

    }



    setFieldErrors({});

    onSubmit({

      email: email.trim(),

      password,

      confirmPassword,

      address: trimmedAddress,

      contact: trimmedContact,

      acceptedTerms,

    });

  };



  return (

    <form onSubmit={handleSubmit} className="partner-register-form">

      <p className="partner-step-intro">

        Use your work email to securely manage your organization on SROTA

        Partner.

      </p>



      <div className="partner-account-badge-row">

        <span className="partner-account-badge form-highlight-surface">

          <Building2 size={14} />

          Organization account

        </span>

        <span className="partner-account-hint form-highlight-surface">

          <Shield size={14} />

          You&apos;ll verify this email before publishing

        </span>

      </div>



      <div className="partner-form-group">

        <label htmlFor="adminEmail" className="partner-field-label">

          Work email

          <FieldErrorHint message={fieldErrors.email} />

        </label>

        <div className="partner-input-with-icon">

          <Mail size={18} className="partner-input-icon" />

          <input

            id="adminEmail"

            type="email"

            className={fieldErrors.email ? 'partner-input--error' : ''}

            value={email}

            onChange={e => {

              setEmail(e.target.value);

              clearFieldError('email');

            }}

            placeholder="name@yourorganization.com"

            disabled={isLoading}

          />

        </div>

      </div>



      <div className="partner-form-group">

        <label htmlFor="adminPassword" className="partner-field-label">

          Password

          <FieldErrorHint message={fieldErrors.password} />

        </label>

        <div className="partner-input-with-icon">

          <Lock size={18} className="partner-input-icon" />

          <input

            id="adminPassword"

            type={showPassword ? 'text' : 'password'}

            className={fieldErrors.password ? 'partner-input--error' : ''}

            value={password}

            onChange={e => {

              setPassword(e.target.value);

              clearFieldError('password');

            }}

            placeholder="Create a strong password"

            disabled={isLoading}

          />

          <button

            type="button"

            className="partner-password-toggle"

            onClick={() => setShowPassword(!showPassword)}

            aria-label={showPassword ? 'Hide password' : 'Show password'}

          >

            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}

          </button>

        </div>

        <PasswordStrengthIndicator password={password} />

      </div>



      <div className="partner-form-group">

        <label htmlFor="adminConfirmPassword" className="partner-field-label">

          Confirm password

          <FieldErrorHint message={fieldErrors.confirmPassword} />

        </label>

        <div className="partner-input-with-icon">

          <Lock size={18} className="partner-input-icon" />

          <input

            id="adminConfirmPassword"

            type={showConfirmPassword ? 'text' : 'password'}

            className={fieldErrors.confirmPassword ? 'partner-input--error' : ''}

            value={confirmPassword}

            onChange={e => {

              setConfirmPassword(e.target.value);

              clearFieldError('confirmPassword');

            }}

            placeholder="Re-enter your password"

            disabled={isLoading}

          />

          <button

            type="button"

            className="partner-password-toggle"

            onClick={() => setShowConfirmPassword(!showConfirmPassword)}

            aria-label={

              showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'

            }

          >

            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}

          </button>

        </div>

      </div>



      <div className="partner-form-group">

        <label htmlFor="orgAddress" className="partner-field-label">

          Address

          <FieldErrorHint message={fieldErrors.address} />

        </label>

        <div className="partner-input-with-icon">

          <MapPin size={18} className="partner-input-icon" />

          <input

            id="orgAddress"

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

        <label htmlFor="orgContact" className="partner-field-label">

          Contact number

          <FieldErrorHint message={fieldErrors.contact} />

        </label>

        <div className="partner-input-with-icon">

          <Phone size={18} className="partner-input-icon" />

          <input

            id="orgContact"

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



      <InfoBanner icon={Lock} compact>
        Your credentials are encrypted and stored securely.
      </InfoBanner>



      <div className="partner-terms-row">

        <label className="partner-terms">

          <input

            type="checkbox"

            checked={acceptedTerms}

            onChange={e => {

              setAcceptedTerms(e.target.checked);

              clearFieldError('acceptedTerms');

            }}

            disabled={isLoading}

          />

          <span>

            I agree to the <a href="#">Terms</a> and{' '}

            <a href="#">Privacy Policy</a>

          </span>

        </label>

        <FieldErrorHint message={fieldErrors.acceptedTerms} />

      </div>



      <div className="partner-wizard-footer">

        {onBack && (

          <button

            type="button"

            className="partner-back-link"

            onClick={onBack}

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



export default RegisterUserStep;

