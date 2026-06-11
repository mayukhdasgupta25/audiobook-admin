import { useEffect } from 'react';
import LoginMarketingPanel from './components/LoginMarketingPanel';
import LoginFormPanel from './components/LoginFormPanel';
import '../../styles/shared/marketing.css';
import '../../styles/pages/login/Login.css';

function Login() {
  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="login-container">
      <LoginMarketingPanel />
      <LoginFormPanel />
    </div>
  );
}

export default Login;
