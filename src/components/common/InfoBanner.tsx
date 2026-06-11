import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Info } from 'lucide-react';
import '../../styles/components/common/InfoBanner.css';
import '../../styles/shared/marketing.css';

interface InfoBannerProps {
  children: ReactNode;
  icon?: LucideIcon;
  compact?: boolean;
  className?: string;
}

function InfoBanner({
  children,
  icon: Icon = Info,
  compact = false,
  className = '',
}: InfoBannerProps) {
  return (
    <div
      className={`info-banner form-highlight-surface${
        compact ? ' info-banner--compact' : ''
      }${className ? ` ${className}` : ''}`}
      role="note"
    >
      <Icon size={16} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export default InfoBanner;
