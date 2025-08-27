import { Navigate, Outlet } from "react-router-dom";

const PrivateAuthRoute = () => {
  const token = localStorage.getItem("token");

  return !token ? <Outlet /> : <Navigate to={"/dashboard"} />;
};

export default PrivateAuthRoute;