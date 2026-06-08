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

  it('renders the landing page hero at /', async () => {
    window.history.pushState({}, '', '/');
    renderApp();
    expect(
      await screen.findByRole('heading', {
        name: /publish and grow your audiobook catalog/i,
      })
    ).toBeInTheDocument();
  });

  it('renders Become a Partner button on landing page', async () => {
    window.history.pushState({}, '', '/');
    renderApp();
    expect(
      await screen.findByRole('button', { name: /become a partner/i })
    ).toBeInTheDocument();
  });

  it('renders login page at /login', async () => {
    window.history.pushState({}, '', '/login');
    renderApp();
    expect(
      await screen.findByRole('heading', { name: /login/i })
    ).toBeInTheDocument();
  });
});
