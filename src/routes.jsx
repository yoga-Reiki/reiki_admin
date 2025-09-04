import React from "react";

const Dashboard = React.lazy(() => import("./view/dashBoard/Dashboard"));
const Users = React.lazy(() => import("./view/users/Users"));
const ErrorPage = React.lazy(() => import("./view/error/Error"));
const AboutUs = React.lazy(() => import("./view/about/Aboutus"));
const Testimonials = React.lazy(() => import("./view/testimonails/Testimonials"));
const Gallery = React.lazy(() => import("./view/gallery/Gallery"));
const ContactUs = React.lazy(() => import("./view/contactUs/ContactUs"));
const Blog = React.lazy(() => import("./view/blog/Blog"));
const Courses = React.lazy(() => import("./view/course/Courses"));
const Product = React.lazy(() => import("./view/product/Product"));
const Order = React.lazy(() => import("./view/order/Order"));
const Profile = React.lazy(() => import("./view/profile/Profile"));

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
    path: '/blog',
    name: 'Blog',
    element: Blog,
  },
  {
    path: '/courses',
    name: 'Courses',
    element: Courses,
  },
  {
    path: '/product',
    name: 'Product',
    element: Product,
  },
  {
    path: '/orders',
    name: 'Order',
    element: Order,
  },
  {
    path: '/contact',
    name: 'ContactUs',
    element: ContactUs,
  },
  {
    path: '/profile',
    name: 'Profile',
    element: Profile,
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