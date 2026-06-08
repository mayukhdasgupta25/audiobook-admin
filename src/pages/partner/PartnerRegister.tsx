import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import {
  registerPartnerUser,
  registerIndividualPartner,
  verifyRegistrationOtp,
  completePartnerOrganizationSetup,
} from '../../utils/partnerApi';
import { endSessionAndRedirectToLogin } from '../../utils/authSession';
import { showApiError } from '../../utils/toast';
import type { PartnerType } from '../../types/partner';
import SelectPartnerTypeStep from './components/SelectPartnerTypeStep';
import RegisterUserStep, {
  type RegisterUserFormData,
} from './components/RegisterUserStep';
import RegisterIndividualDetailsStep, {
  type RegisterIndividualDetailsData,
} from './components/RegisterIndividualDetailsStep';
import RegisterIndividualPasswordStep, {
  type RegisterIndividualPasswordData,
} from './components/RegisterIndividualPasswordStep';
import VerifyOtpStep, {
  type VerifyOtpFormData,
} from './components/VerifyOtpStep';
import RegisterOrganizationStep, {
  type RegisterOrganizationFormData,
} from './components/RegisterOrganizationStep';
import '../../styles/pages/partner/PartnerRegister.css';
const ADMIN_ROLE = 'ADMIN';
const ORGANIZATION_SUBTITLES: Record<1 | 2 | 3 | 4, string> = {
  1: 'Who are you?',
  2: 'Create your account',
  3: 'Verify your account',
  4: 'Register your organization',
};

const INDIVIDUAL_SUBTITLES: Record<1 | 2 | 3 | 4, string> = {
  1: 'Who are you?',
  2: 'Your personal details',
  3: 'Create your password',
  4: 'Verify your account',
};

function PartnerRegister() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [partnerType, setPartnerType] = useState<PartnerType | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState('');
  const [individualDetails, setIndividualDetails] =
    useState<RegisterIndividualDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resetToPartnerTypeSelection = () => {
    setPartnerType(null);
    setIndividualDetails(null);
    setEmail('');
    setStep(1);
  };

  const handleSelectPartnerType = (type: PartnerType) => {
    setPartnerType(type);
    setStep(2);
  };

  const handleOrganizationAccountSubmit = async (
    data: RegisterUserFormData
  ) => {
    setIsLoading(true);
    try {
      const registeredEmail = await registerPartnerUser({
        email: data.email,
        password: data.password,
        role: ADMIN_ROLE,
      });
      setEmail(registeredEmail);
      setStep(3);
    } catch (err) {
      showApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndividualDetailsSubmit = (
    data: RegisterIndividualDetailsData
  ) => {
    setIndividualDetails(data);
    setStep(3);
  };

  const handleIndividualPasswordSubmit = async (
    data: RegisterIndividualPasswordData
  ) => {
    if (!individualDetails) {
      return;
    }
    setIsLoading(true);
    try {
      const registeredEmail = await registerIndividualPartner({
        email: individualDetails.email,
        password: data.password,
        firstName: individualDetails.firstName,
        lastName: individualDetails.lastName,
        address: individualDetails.address || undefined,
        contact: individualDetails.contact || undefined,
      });
      setEmail(registeredEmail);
      setStep(4);
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
        type: partnerType === 'individual' ? 'author' : 'organization',
        firstName:
          partnerType === 'organization'
            ? data.firstName || undefined
            : undefined,
        lastName:
          partnerType === 'organization'
            ? data.lastName || undefined
            : undefined,
      });
      if (partnerType === 'individual') {
        await endSessionAndRedirectToLogin(
          dispatch,
          navigate,
          'Registration complete. Please sign in.'
        );
        return;
      }
      setStep(4);
    } catch (err) {
      showApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrganization = async (
    data: RegisterOrganizationFormData
  ) => {
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
    partnerType === 'individual'
      ? INDIVIDUAL_SUBTITLES[step]
      : partnerType === 'organization'
        ? ORGANIZATION_SUBTITLES[step]
        : ORGANIZATION_SUBTITLES[1];
  return (
    <div className="partner-register-container">
      <div className="partner-register-card">
        <h1 className="partner-register-title">Become a Partner</h1>
        <div
          className="partner-progress"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={4}
          aria-label={`Registration progress, step ${step} of 4`}
        >
          {[1, 2, 3, 4].map(segment => (
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
          <SelectPartnerTypeStep
            isLoading={isLoading}
            onSelect={handleSelectPartnerType}
          />
        )}
        {step === 2 && partnerType === 'organization' && (
          <RegisterUserStep
            isLoading={isLoading}
            onSubmit={handleOrganizationAccountSubmit}
            onBack={resetToPartnerTypeSelection}
          />
        )}
        {step === 2 && partnerType === 'individual' && (
          <RegisterIndividualDetailsStep
            isLoading={isLoading}
            onSubmit={handleIndividualDetailsSubmit}
            onBack={resetToPartnerTypeSelection}
          />
        )}
        {step === 3 && partnerType === 'organization' && (
          <VerifyOtpStep
            email={email}
            isLoading={isLoading}
            variant="organization"
            onVerify={handleVerifyOtp}
            onBack={() => setStep(2)}
          />
        )}
        {step === 3 && partnerType === 'individual' && (
          <RegisterIndividualPasswordStep
            isLoading={isLoading}
            onSubmit={handleIndividualPasswordSubmit}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && partnerType === 'organization' && (
          <RegisterOrganizationStep
            isLoading={isLoading}
            onSubmit={handleCreateOrganization}
            onBack={() => setStep(3)}
          />
        )}
        {step === 4 && partnerType === 'individual' && (
          <VerifyOtpStep
            email={email}
            isLoading={isLoading}
            variant="individual"
            onVerify={handleVerifyOtp}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
}

export default PartnerRegister;
