import type { LucideIcon, LucideProps } from 'lucide-react';

interface SolidIconProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
}

/** Renders a lucide icon with a filled, solid appearance */
function SolidIcon({ icon: Icon, size = 20, className, ...props }: SolidIconProps) {
  return (
    <Icon
      size={size}
      className={className}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.25}
      {...props}
    />
  );
}

export default SolidIcon;
