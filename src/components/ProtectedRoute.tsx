import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { useModuleAccess, ROUTE_MODULE_MAP } from '@/hooks/useUserRole';

const ADMIN_ONLY_ROUTES = ['/contratos', '/relatorios', '/permissoes'];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { hasModule, isAdmin, loading: moduleLoading } = useModuleAccess();

  if (loading || moduleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only routes
  if (ADMIN_ONLY_ROUTES.includes(location.pathname) && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Check module access for the current route
  const requiredModule = ROUTE_MODULE_MAP[location.pathname];
  if (requiredModule && !hasModule(requiredModule)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
