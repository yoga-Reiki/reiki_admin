import React from "react";

const Dashboard = React.lazy(() => import("./view/dashBoard/index"));
const Users = React.lazy(() => import("./view/users/index"));
const ErrorPage = React.lazy(() => import("./view/error/Error"));

const routes = [
  {
    path: "/dashboard",
    name: "Home",
    element: Dashboard,
  },
  {
    path: '/users',
    name: 'Users',
    element: Users,
  },
  {
    path: '/error',
    name: 'Error',
    element: ErrorPage,
  },
];

export default routes;