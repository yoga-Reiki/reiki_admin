import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("admin_accessToken");

  return token ? <Outlet /> : <Navigate to={"/"} />;
};

export default PrivateRoute;