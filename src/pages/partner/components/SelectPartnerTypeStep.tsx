import type { KeyboardEvent } from 'react';
import type { PartnerType } from '../../../types/partner';

interface PartnerTypeOption {
   type: PartnerType;
   label: string;
   description: string;
   icon: string;
}

const PARTNER_TYPE_OPTIONS: PartnerTypeOption[] = [
   {
      type: 'organization',
      label: 'Organization',
      description: 'Register as a company or team with admin access',
      icon: '🏢',
   },
   {
      type: 'individual',
      label: 'Individual',
      description: 'Register as an independent author',
      icon: '✍️',
   },
];

interface SelectPartnerTypeStepProps {
   isLoading: boolean;
   onSelect: (type: PartnerType) => void;
}

function SelectPartnerTypeStep({ isLoading, onSelect }: SelectPartnerTypeStepProps) {
   const handleKeyDown = (
      event: KeyboardEvent<HTMLDivElement>,
      type: PartnerType
   ): void => {
      if (event.key === 'Enter' || event.key === ' ') {
         event.preventDefault();
         if (!isLoading) {
            onSelect(type);
         }
      }
   };

   return (
      <div className="partner-type-step">
         <p className="partner-form-section-title">Who are you?</p>

         <div className="partner-type-grid">
            {PARTNER_TYPE_OPTIONS.map((option) => (
               <div
                  key={option.type}
                  role="button"
                  tabIndex={isLoading ? -1 : 0}
                  className="partner-type-card"
                  aria-label={`Register as ${option.label}`}
                  onClick={() => {
                     if (!isLoading) {
                        onSelect(option.type);
                     }
                  }}
                  onKeyDown={(event) => handleKeyDown(event, option.type)}
               >
                  <span className="partner-type-icon" aria-hidden="true">
                     {option.icon}
                  </span>
                  <span className="partner-type-label">{option.label}</span>
                  <span className="partner-type-description">{option.description}</span>
               </div>
            ))}
         </div>
      </div>
   );
}

export default SelectPartnerTypeStep;
