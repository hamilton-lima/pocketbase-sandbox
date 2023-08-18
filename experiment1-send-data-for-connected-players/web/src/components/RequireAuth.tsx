import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthBear } from "../services/auth.bear";

export const RequireAuth = () => {
  const { user } = useAuthBear();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate to={{ pathname: "/sign-in" }} state={{ location }} replace />
    );
  }

  return <Outlet />;
};
