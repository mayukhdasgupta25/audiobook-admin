import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { login } from '../../utils/api';
import { isAuthenticated, setAuthenticated } from '../../utils/auth';
import { setAuthenticated as setAuthRedux, setUser } from '../../store/slices/authSlice';
import type { LoginRequest, LoginResponse } from '../../types/auth';
import { showApiError } from '../../utils/toast';
import '../../styles/pages/login/Login.css';

function Login() {
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const { isAuthenticated: isAuth } = useAppSelector((state) => state.auth);
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [emailError, setEmailError] = useState<string>('');

   /**
    * Redirect to home if already authenticated
    */
   useEffect(() => {
      if (isAuthenticated() || isAuth) {
         navigate('/home', { replace: true });
      }
   }, [navigate, isAuth]);

   /**
    * Validates email format using basic regex pattern
    */
   const validateEmail = (emailValue: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(emailValue);
   };

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
         const loginData: LoginRequest = {
            email: email.trim(),
            password: password,
            clientType: 'browser',
         };

         const loginResponse: LoginResponse = await login(loginData);

         // Handle successful login - update both sessionStorage and Redux
         setAuthenticated(true);
         dispatch(setAuthRedux(true));

         // Set user info if available in response
         if (loginResponse.user) {
            dispatch(setUser({
               email: loginResponse.user.email
            }));
         } else {
            // If no user object, at least set email from login
            dispatch(setUser({
               email: email.trim(),
            }));
         }

         navigate('/home', { replace: true });

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
                     onChange={(e) => {
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
                     onChange={(e) => {
                        setPassword(e.target.value);
                     }}
                     placeholder="Enter your password"
                     disabled={isLoading}
                  />
               </div>

               <button
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
               >
                  {isLoading ? 'Logging in...' : 'Login'}
               </button>
            </form>
         </div>
      </div>
   );
}

export default Login;

