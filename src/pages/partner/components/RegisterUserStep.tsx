import { FormEvent, useState } from 'react';
import InfoHint from '../../../components/common/InfoHint';
import Button from '../../../components/common/Button';
import { validateEmail } from '../../../utils/validation';

export interface RegisterUserFormData {
   email: string;
   password: string;
}

interface RegisterUserStepProps {
   isLoading: boolean;
   onSubmit: (data: RegisterUserFormData) => void;
}

function RegisterUserStep({ isLoading, onSubmit }: RegisterUserStepProps) {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');

      if (!validateEmail(email)) {
         setError('Please enter a valid email address');
         return;
      }

      if (!password || password.length < 8) {
         setError('Password must be at least 8 characters');
         return;
      }

      onSubmit({
         email: email.trim(),
         password,
      });
   };

   return (
      <form onSubmit={handleSubmit} className="partner-register-form">
         <div className="partner-form-group">
            <label htmlFor="role">Role</label>
            <input id="role" type="text" value="ADMIN" readOnly disabled={isLoading} />
         </div>

         <p className="partner-form-section-title">
            Account details
            <InfoHint message="You can add more admin members later" />
         </p>

         <div className="partner-form-group">
            <label htmlFor="adminEmail">Email</label>
            <input
               id="adminEmail"
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
            <label htmlFor="adminPassword">Password</label>
            <input
               id="adminPassword"
               type="password"
               value={password}
               onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
               }}
               placeholder="Enter your password"
               disabled={isLoading}
            />
         </div>

         {error && <span className="partner-error-message">{error}</span>}

         <div className="partner-form-actions">
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
               Continue
            </Button>
         </div>
      </form>
   );
}

export default RegisterUserStep;
