import { FormEvent, useEffect, useMemo, useState } from 'react';

import { ArrowRight, Building2, Globe, Tag, Users } from 'lucide-react';

import Button from '../../../components/common/Button';

import FieldErrorHint from '../../../components/common/FieldErrorHint';

import InfoBanner from '../../../components/common/InfoBanner';

import PillSelector from '../../../components/common/PillSelector';

import ImageUploadZone from '../../../components/common/ImageUploadZone';

import OrganizationBrandPreview from '../../../components/common/OrganizationBrandPreview';

import {

  ORGANIZATION_GENRE_OPTIONS,

  TEAM_SIZE_OPTIONS,

} from '../../../content/marketingContent';

import type { OrganizationProfileData } from '../../../store/slices/partnerRegistrationSlice';

import type { TeamSize } from '../../../types/partner';



export interface RegisterOrganizationFormData {

  organizationName: string;

  websiteUrl: string;

  teamSize: TeamSize;

  preferredGenreId: string;

  image: File | null;

}



interface RegisterOrganizationStepProps {

  isLoading: boolean;

  initialData?: OrganizationProfileData;

  onSubmit: (data: RegisterOrganizationFormData) => void;

  onBack?: (draft: OrganizationProfileData) => void;

}



function RegisterOrganizationStep({

  isLoading,

  initialData,

  onSubmit,

  onBack,

}: RegisterOrganizationStepProps) {

  const [organizationName, setOrganizationName] = useState(

    initialData?.organizationName ?? ''

  );

  const [websiteUrl, setWebsiteUrl] = useState(initialData?.websiteUrl ?? '');

  const [teamSize, setTeamSize] = useState<TeamSize | null>(

    initialData?.teamSize ?? null

  );

  const [preferredGenreId, setPreferredGenreId] = useState<string | null>(

    initialData?.preferredGenreId ?? null

  );

  const [image, setImage] = useState<File | null>(initialData?.image ?? null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});



  const logoPreviewUrl = useMemo(

    () => (image ? URL.createObjectURL(image) : null),

    [image]

  );



  useEffect(() => {

    return () => {

      if (logoPreviewUrl) {

        URL.revokeObjectURL(logoPreviewUrl);

      }

    };

  }, [logoPreviewUrl]);



  useEffect(() => {

    setOrganizationName(initialData?.organizationName ?? '');

    setWebsiteUrl(initialData?.websiteUrl ?? '');

    setTeamSize(initialData?.teamSize ?? null);

    setPreferredGenreId(initialData?.preferredGenreId ?? null);

    setImage(initialData?.image ?? null);

  }, [initialData]);



  const handleBack = () => {

    onBack?.({

      organizationName,

      websiteUrl,

      teamSize,

      preferredGenreId,

      image,

    });

  };



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



    if (!organizationName.trim()) {

      errors.organizationName = 'Organization name is required';

    }



    if (!teamSize) {

      errors.teamSize = 'Please select a team size';

    }



    if (!preferredGenreId) {

      errors.preferredGenreId = 'Please select a primary genre';

    }



    if (Object.keys(errors).length > 0) {

      setFieldErrors(errors);

      return;

    }



    setFieldErrors({});

    onSubmit({

      organizationName: organizationName.trim(),

      websiteUrl: websiteUrl.trim(),

      teamSize: teamSize as TeamSize,

      preferredGenreId: preferredGenreId as string,

      image,

    });

  };



  return (

    <form onSubmit={handleSubmit} className="partner-register-form partner-org-form">

      <p className="partner-step-intro">

        Add the essentials now — you can refine your brand and team settings

        later.

      </p>



      <div className="partner-org-form-grid">

        <div className="partner-org-form-main">

          <div className="partner-form-group">

            <label htmlFor="organizationName" className="partner-field-label">

              Organization name

              <FieldErrorHint message={fieldErrors.organizationName} />

            </label>

            <div className="partner-input-with-icon">

              <Building2 size={18} className="partner-input-icon" />

              <input

                id="organizationName"

                type="text"

                className={

                  fieldErrors.organizationName ? 'partner-input--error' : ''

                }

                value={organizationName}

                onChange={e => {

                  setOrganizationName(e.target.value);

                  clearFieldError('organizationName');

                }}

                placeholder="Enter organization name"

                disabled={isLoading}

              />

            </div>

            <p className="partner-field-hint">

              This is how your organization will appear on SROTA.

            </p>

          </div>



          <div className="partner-form-group">

            <label htmlFor="websiteUrl">Website (optional)</label>

            <div className="partner-input-with-icon">

              <Globe size={18} className="partner-input-icon" />

              <input

                id="websiteUrl"

                type="url"

                value={websiteUrl}

                onChange={e => setWebsiteUrl(e.target.value)}

                placeholder="https://yourwebsite.com"

                disabled={isLoading}

              />

            </div>

            <p className="partner-field-hint">

              Add your website to help listeners learn more.

            </p>

          </div>



          <div

            className={`partner-form-group${

              fieldErrors.teamSize ? ' partner-form-group--error' : ''

            }`}

          >

            <label className="partner-field-label">

              <Users size={16} />

              Team size

              <FieldErrorHint message={fieldErrors.teamSize} />

            </label>

            <PillSelector

              name="Team size"

              variant="solid"

              options={TEAM_SIZE_OPTIONS}

              value={teamSize}

              onChange={value => {

                setTeamSize(value);

                clearFieldError('teamSize');

              }}

              disabled={isLoading}

            />

          </div>



          <div

            className={`partner-form-group${

              fieldErrors.preferredGenreId ? ' partner-form-group--error' : ''

            }`}

          >

            <label className="partner-field-label">

              <Tag size={16} />

              Primary genre / catalog focus

              <FieldErrorHint message={fieldErrors.preferredGenreId} />

            </label>

            <PillSelector

              name="Primary genre"

              variant="solid"

              options={[...ORGANIZATION_GENRE_OPTIONS]}

              value={preferredGenreId}

              onChange={value => {

                setPreferredGenreId(value);

                clearFieldError('preferredGenreId');

              }}

              disabled={isLoading}

            />

          </div>

        </div>



        <div className="partner-org-form-side">

          <div className="partner-form-group">

            <label>Logo / brand image</label>

            <ImageUploadZone

              value={image}

              onChange={setImage}

              disabled={isLoading}

              previewUrl={logoPreviewUrl}

            />

          </div>



          <OrganizationBrandPreview

            organizationName={organizationName}

            logoPreviewUrl={logoPreviewUrl}

          />

        </div>

      </div>



      <InfoBanner>
        You can add more teammates and brand details after onboarding.
      </InfoBanner>



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



export default RegisterOrganizationStep;

