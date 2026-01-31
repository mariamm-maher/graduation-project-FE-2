import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

/**
 * ProtectedRoute Component
 * Protects routes by checking if user is authenticated
 * Redirects to login page if no token/user exists in auth store
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // Check if user is authenticated (has token and user data)
  if (!isAuthenticated || !token || !user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (protected content)
  return children;
}

/**
 * AuthorizedRoute Component
 * Protects routes by checking if user has required roles
 * Redirects to 404 page if user doesn't have the required role
 * 
 * @param {Array} allowedRoles - Array of roles allowed to access this route (e.g., ['ADMIN', 'CAMPAIGN_OWNER'])
 * @param {ReactNode} children - The protected content to render
 */
export function AuthorizedRoute({ allowedRoles = [], children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // First check authentication
  if (!isAuthenticated || !token || !user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Get user's roles from the store
  const userRoles = user?.roles || [];

  // Check if user has at least one of the allowed roles
  const hasRequiredRole = allowedRoles.some(role => 
    userRoles.includes(role)
  );

  // If user doesn't have the required role, redirect to 404
  if (!hasRequiredRole) {
    return <Navigate to="/404" replace />;
  }

  // If authorized, render the children (protected content)
  return children;
}

export default ProtectedRoute;
