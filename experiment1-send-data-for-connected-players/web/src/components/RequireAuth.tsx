import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePocket } from "../services/PocketProvider";

export const RequireAuth = () => {
  const { user } = usePocket();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate to={{ pathname: "/sign-in" }} state={{ location }} replace />
    );
  }

  return <Outlet />;
};
