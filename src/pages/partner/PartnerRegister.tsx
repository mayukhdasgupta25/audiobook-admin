import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import {
   registerPartnerUser,
   verifyRegistrationOtp,
   completePartnerOrganizationSetup,
} from '../../utils/partnerApi';
import { endSessionAndRedirectToLogin } from '../../utils/authSession';
import { showApiError } from '../../utils/toast';
import RegisterUserStep, { type RegisterUserFormData } from './components/RegisterUserStep';
import VerifyOtpStep, { type VerifyOtpFormData } from './components/VerifyOtpStep';
import RegisterOrganizationStep, {
   type RegisterOrganizationFormData,
} from './components/RegisterOrganizationStep';
import '../../styles/pages/partner/PartnerRegister.css';

const ADMIN_ROLE = 'ADMIN';

function PartnerRegister() {
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const [step, setStep] = useState<1 | 2 | 3>(1);
   const [email, setEmail] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const handleStepOneSubmit = async (data: RegisterUserFormData) => {
      setIsLoading(true);

      try {
         const registeredEmail = await registerPartnerUser({
            email: data.email,
            password: data.password,
            role: ADMIN_ROLE,
         });

         setEmail(registeredEmail);
         setStep(2);
      } catch (err) {
         showApiError(err);
      } finally {
         setIsLoading(false);
      }
   };

   const handleVerifyOtp = async (data: VerifyOtpFormData) => {
      setIsLoading(true);

      try {
         await verifyRegistrationOtp({
            email,
            otp: data.otp,
            firstName: data.firstName || undefined,
            lastName: data.lastName || undefined,
         });

         setStep(3);
      } catch (err) {
         showApiError(err);
      } finally {
         setIsLoading(false);
      }
   };

   const handleCreateOrganization = async (data: RegisterOrganizationFormData) => {
      setIsLoading(true);

      try {
         await completePartnerOrganizationSetup({
            organizationName: data.organizationName,
         });

         await endSessionAndRedirectToLogin(dispatch, navigate);
      } catch (err) {
         showApiError(err);
         setIsLoading(false);
      }
   };

   const stepSubtitle =
      step === 1
         ? 'Create your account'
         : step === 2
           ? 'Verify your account'
           : 'Register your organization';

   return (
      <div className="partner-register-container">
         <div className="partner-register-card">
            <h1 className="partner-register-title">Become a Partner</h1>

            <div
               className="partner-progress"
               role="progressbar"
               aria-valuenow={step}
               aria-valuemin={1}
               aria-valuemax={3}
               aria-label={`Registration progress, step ${step} of 3`}
            >
               {[1, 2, 3].map((segment) => (
                  <div
                     key={segment}
                     className={`partner-progress-segment${
                        segment <= step ? ' partner-progress-segment--active' : ''
                     }`}
                  />
               ))}
            </div>

            <p className="partner-register-subtitle">{stepSubtitle}</p>

            {step === 1 && (
               <RegisterUserStep isLoading={isLoading} onSubmit={handleStepOneSubmit} />
            )}

            {step === 2 && (
               <VerifyOtpStep
                  email={email}
                  isLoading={isLoading}
                  onVerify={handleVerifyOtp}
                  onBack={() => setStep(1)}
               />
            )}

            {step === 3 && (
               <RegisterOrganizationStep
                  isLoading={isLoading}
                  onSubmit={handleCreateOrganization}
                  onBack={() => setStep(2)}
               />
            )}
         </div>
      </div>
   );
}

export default PartnerRegister;
