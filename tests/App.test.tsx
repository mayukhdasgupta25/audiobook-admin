import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import App from '../src/App';

function renderApp() {
   return render(
      <Provider store={store}>
         <App />
      </Provider>
   );
}

describe('App', () => {
   const originalPathname = window.location.pathname;

   afterEach(() => {
      window.history.pushState({}, '', originalPathname);
   });

   it('renders the landing page hero at /', () => {
      window.history.pushState({}, '', '/');
      renderApp();
      expect(
         screen.getByRole('heading', { name: /publish and grow your audiobook catalog/i })
      ).toBeInTheDocument();
   });

   it('renders Become a Partner button on landing page', () => {
      window.history.pushState({}, '', '/');
      renderApp();
      expect(screen.getByRole('button', { name: /become a partner/i })).toBeInTheDocument();
   });

   it('renders login page at /login', () => {
      window.history.pushState({}, '', '/login');
      renderApp();
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
   });
});
