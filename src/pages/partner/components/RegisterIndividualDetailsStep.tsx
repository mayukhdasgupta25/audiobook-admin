import { FormEvent, useState } from 'react';
import Button from '../../../components/common/Button';
import { validateEmail } from '../../../utils/validation';

export interface RegisterIndividualDetailsData {
   firstName: string;
   lastName: string;
   email: string;
   address: string;
   contact: string;
}

interface RegisterIndividualDetailsStepProps {
   isLoading: boolean;
   onSubmit: (data: RegisterIndividualDetailsData) => void;
   onBack?: () => void;
}

function RegisterIndividualDetailsStep({
   isLoading,
   onSubmit,
   onBack,
}: RegisterIndividualDetailsStepProps) {
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [email, setEmail] = useState('');
   const [address, setAddress] = useState('');
   const [contact, setContact] = useState('');
   const [error, setError] = useState('');

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');

      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      const trimmedEmail = email.trim();
      const trimmedAddress = address.trim();
      const trimmedContact = contact.trim();

      if (!trimmedFirstName || trimmedFirstName.length < 2) {
         setError('First name must be at least 2 characters');
         return;
      }

      if (!trimmedLastName || trimmedLastName.length < 2) {
         setError('Last name must be at least 2 characters');
         return;
      }

      if (!trimmedEmail || !validateEmail(trimmedEmail)) {
         setError('Please enter a valid email address');
         return;
      }

      if (trimmedAddress.length > 200) {
         setError('Address must be less than 200 characters');
         return;
      }

      if (trimmedContact.length > 20) {
         setError('Contact must be less than 20 characters');
         return;
      }

      onSubmit({
         firstName: trimmedFirstName,
         lastName: trimmedLastName,
         email: trimmedEmail,
         address: trimmedAddress,
         contact: trimmedContact,
      });
   };

   return (
      <form onSubmit={handleSubmit} className="partner-register-form">
         <p className="partner-form-section-title">Your details</p>

         <div className="partner-form-group">
            <label htmlFor="individualFirstName">First name</label>
            <input
               id="individualFirstName"
               type="text"
               value={firstName}
               onChange={(e) => {
                  setFirstName(e.target.value);
                  setError('');
               }}
               placeholder="Enter your first name"
               disabled={isLoading}
            />
         </div>

         <div className="partner-form-group">
            <label htmlFor="individualLastName">Last name</label>
            <input
               id="individualLastName"
               type="text"
               value={lastName}
               onChange={(e) => {
                  setLastName(e.target.value);
                  setError('');
               }}
               placeholder="Enter your last name"
               disabled={isLoading}
            />
         </div>

         <div className="partner-form-group">
            <label htmlFor="individualEmail">Email</label>
            <input
               id="individualEmail"
               type="email"
               value={email}
               onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
               }}
               placeholder="Enter your email"
               disabled={isLoading}
            />
         </div>

         <div className="partner-form-group">
            <label htmlFor="individualAddress">Address</label>
            <input
               id="individualAddress"
               type="text"
               value={address}
               onChange={(e) => {
                  setAddress(e.target.value);
                  setError('');
               }}
               placeholder="Enter your address (optional)"
               disabled={isLoading}
            />
         </div>

         <div className="partner-form-group">
            <label htmlFor="individualContact">Contact</label>
            <input
               id="individualContact"
               type="text"
               value={contact}
               onChange={(e) => {
                  setContact(e.target.value);
                  setError('');
               }}
               placeholder="Enter your contact number (optional)"
               disabled={isLoading}
            />
         </div>

         {error && <span className="partner-error-message">{error}</span>}

         <div className="partner-form-actions">
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
               Continue
            </Button>
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
         </div>
      </form>
   );
}

export default RegisterIndividualDetailsStep;
