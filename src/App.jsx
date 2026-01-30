import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './config/toast.css';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import InfluencerDashboard from './pages/InfluencerDashboard.jsx';
import Landing from './pages/Landing.jsx';
import AuthForm from './features/auth/AuthForm.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/signup" element={<AuthForm />} /> 
        <Route path="/dashboard/owner/*" element={<OwnerDashboard />} />
        <Route path="/dashboard/influencer/*" element={<InfluencerDashboard />} />
        <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;