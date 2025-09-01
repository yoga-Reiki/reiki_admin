import { Navigate, Outlet } from "react-router-dom";

const PrivateAuthRoute = () => {
  const token = localStorage.getItem("admin_accessToken");

  return !token ? <Outlet /> : <Navigate to={"/dashboard"} />;
};

export default PrivateAuthRoute;