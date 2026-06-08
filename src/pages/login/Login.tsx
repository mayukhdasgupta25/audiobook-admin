import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { login } from '../../utils/api';
import { setAuthenticated } from '../../utils/auth';
import { ensureCsrfToken } from '../../utils/csrf';
import { getBrowserDeviceInfo } from '../../utils/device';
import {
  setAuthenticated as setAuthRedux,
  setUserRole,
  setUser,
} from '../../store/slices/authSlice';
import { getUserRoleFromAuthResponse } from '../../utils/authRole';
import type { LoginRequest, LoginResponse } from '../../types/auth';
import { showApiError } from '../../utils/toast';
import { validateEmail } from '../../utils/validation';
import '../../styles/pages/login/Login.css';
function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated: isAuth, isInitialized } = useAppSelector(
    state => state.auth
  );
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  /**
   * Redirect to home if already authenticated
   */
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    if (isAuth) {
      navigate('/audiobooks', { replace: true });
    }
  }, [navigate, isAuth, isInitialized]);
  /**
   * Handles form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError('');
    // Validate email format
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    // Validate required fields
    if (!email || !password) {
      setEmailError('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      await ensureCsrfToken();
      const loginData: LoginRequest = {
        email: email.trim(),
        password: password,
        clientType: 'browser',
        device: getBrowserDeviceInfo(),
      };

      const loginResponse: LoginResponse = await login(loginData);
      // Handle successful login - update both sessionStorage and Redux
      setAuthenticated(true);
      dispatch(setAuthRedux(true));
      const role = getUserRoleFromAuthResponse(loginResponse);
      if (role) {
        dispatch(setUserRole(role));
      }
      // Set user info if available in response
      if (loginResponse.user) {
        dispatch(
          setUser({
            email: loginResponse.user.email,
          })
        );
      } else {
        // If no user object, at least set email from login
        dispatch(
          setUser({
            email: email.trim(),
          })
        );
      }
      navigate('/audiobooks', { replace: true });
    } catch (err) {
      showApiError(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Audiobook Admin</h1>
        <h2 className="login-subtitle">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              placeholder="Enter your email"
              disabled={isLoading}
              className={emailError ? 'input-error' : ''}
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
