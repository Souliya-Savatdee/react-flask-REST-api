import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();


  const accessToken = auth?.access_token || "";
  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  
  return decodedToken?.role === "admin" ? (
    <Outlet />
  ) : auth?.access_token ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
export default RequireAuth;
