import { useNavigate } from 'react-router-dom';
import Logo from '../../../components/common/Logo';
import Button from '../../../components/common/Button';

function LandingHeader() {
  const navigate = useNavigate();

  return (
    <header className="landing-header">
      <div className="landing-header-inner">
        <Logo to="/" />
        <div className="landing-header-actions">
          <nav className="landing-nav" aria-label="Main">
            <a href="#features" className="landing-nav-link">
              Features
            </a>
            <a href="#benefits" className="landing-nav-link">
              Benefits
            </a>
            <a href="#resources" className="landing-nav-link">
              Resources
            </a>
          </nav>
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
          >
            Already a Partner?
          </Button>
        </div>
      </div>
    </header>
  );
}

export default LandingHeader;
