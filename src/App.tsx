import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/redux';
import LoadingSpinner from './components/common/LoadingSpinner';

const Landing = lazy(() => import('./pages/landing/Landing'));
const Login = lazy(() => import('./pages/login/Login'));
const PartnerRegister = lazy(() => import('./pages/partner/PartnerRegister'));
const Layout = lazy(() => import('./components/layout/Layout'));
const Audiobooks = lazy(() => import('./pages/audiobooks/Audiobooks'));
const Chapters = lazy(() => import('./pages/chapters/Chapters'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Management = lazy(() => import('./pages/management/Management'));
const Inbox = lazy(() => import('./pages/inbox/Inbox'));

/**
 * Protected Route component
 */
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, isInitialized } = useAppSelector(
    state => state.auth
  );

  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
            }}
          >
            <LoadingSpinner />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/partner/register" element={<PartnerRegister />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/home"
              element={<Navigate to="/audiobooks" replace />}
            />
            <Route path="/audiobooks" element={<Audiobooks />} />
            <Route path="/audiobooks/:id/chapters" element={<Chapters />} />
            <Route
              path="/analytics"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/management" element={<Management />} />
            <Route path="/inbox" element={<Inbox />} />
          </Route>
          <Route path="*" element={<Navigate to="/audiobooks" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
