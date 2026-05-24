import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/redux';
import Landing from './pages/landing/Landing';
import Login from './pages/login/Login';
import PartnerRegister from './pages/partner/PartnerRegister';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Audiobooks from './pages/audiobooks/Audiobooks';
import Chapters from './pages/chapters/Chapters';
import Dashboard from './pages/dashboard/Dashboard';
import Management from './pages/management/Management';
import Inbox from './pages/inbox/Inbox';

/**
 * Protected Route component
 */
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
   const { isAuthenticated } = useAppSelector((state) => state.auth);

   if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
   }
   return children;
};

function App() {
   return (
      <BrowserRouter>
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
               <Route path="/home" element={<Home />} />
               <Route path="/audiobooks" element={<Audiobooks />} />
               <Route path="/audiobooks/:id/chapters" element={<Chapters />} />
               <Route path="/analytics" element={<Navigate to="/dashboard" replace />} />
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/management" element={<Management />} />
               <Route path="/inbox" element={<Inbox />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;

