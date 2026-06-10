import { Link } from 'react-router-dom';
import { SROTA_LOGO_PATH } from '../../utils/config';
import '../../styles/shared/marketing.css';

interface LogoProps {
  to?: string;
  className?: string;
}

function Logo({ to, className = '' }: LogoProps) {
  const content = (
    <>
      <img src={SROTA_LOGO_PATH} alt="Srota" />
      <span className="marketing-logo-text">
        <span className="marketing-logo-brand text-gradient">SROTA</span>
        <span className="marketing-logo-suffix">Partner</span>
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`marketing-logo ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={`marketing-logo ${className}`}>{content}</div>;
}

export default Logo;
