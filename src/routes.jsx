import React from "react";

const Dashboard = React.lazy(() => import("./view/dashBoard/index"));
const Users = React.lazy(() => import("./view/users/index"));
const ErrorPage = React.lazy(() => import("./view/error/Error"));
const AboutUs = React.lazy(() => import("./view/about/Aboutus"));
const Testimonials = React.lazy(() => import("./view/testimonails/Testimonials"));
const Gallery = React.lazy(() => import("./view/gallery/Gallery"));
const ContactUs = React.lazy(() => import("./view/contactUs/ContactUs"));

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
    path: '/gallery',
    name: 'Gallery',
    element: Gallery,
  },
  {
    path: '/aboutus',
    name: 'AboutUs',
    element: AboutUs,
  },
  {
    path: '/contact',
    name: 'ContactUs',
    element: ContactUs,
  },
  {
    path: '/testimonials',
    name: 'Testimonials',
    element: Testimonials,
  },
  {
    path: '/error',
    name: 'Error',
    element: ErrorPage,
  },
];

export default routes;