import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './config/toast.css';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import InfluencerDashboard from './pages/InfluencerDashboard.jsx';
import Landing from './pages/Landing.jsx';
import AuthForm from './features/auth/AuthForm.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProtectedRoute, { AuthorizedRoute } from './pages/protectRoute.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/signup" element={<AuthForm />} /> 
        <Route path="/404" element={<NotFound />} />
        
        <Route path="/dashboard/owner/*" element={
          <AuthorizedRoute allowedRoles={['OWNER']}>
            <OwnerDashboard />
          </AuthorizedRoute>
        } />
        
        <Route path="/dashboard/influencer/*" element={
          <AuthorizedRoute allowedRoles={['INFLUENCER']}>
            <InfluencerDashboard />
          </AuthorizedRoute>
        } />
        
        <Route path="/dashboard/admin/*" element={
          <AuthorizedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </AuthorizedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;