import React from "react";

const Dashboard = React.lazy(() => import("./view/dashBoard/index"));

const routes = [
  {
    path: "/dashboard",
    name: "Home",
    element: Dashboard,
  },
];

export default routes;