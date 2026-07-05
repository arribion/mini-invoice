import { type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    toast.error("Please log in to view this page.");
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the protected page
  return <>{children}</>;
};
