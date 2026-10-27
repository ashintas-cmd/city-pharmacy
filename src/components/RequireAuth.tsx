import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "@/components/Skeletons";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!user) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, adminLoading } = useAuth();
  const location = useLocation();

  if (loading || (user && adminLoading)) return <PageLoader />;
  if (!user) {
   const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/admin?redirect=${encodeURIComponent(redirect)}`} replace />;
  }
  if (!isAdmin) return <Navigate to="/admin?denied=1" replace />;
  return <>{children}</>;
}
