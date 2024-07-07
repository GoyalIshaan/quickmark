import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import AllBlogs from "./pages/AllBlogs";
import Blog from "./pages/BlogPost";
import CreateBlogPost from "./pages/Create";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import EditBlogPost from "./pages/EditBlog";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/blogs",
        element: <AllBlogs />,
      },
      {
        path: "/blogs/:id",
        element: <Blog />,
      },
      {
        path: "/create",
        element: <CreateBlogPost />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/edit/:blogId",
        element: <EditBlogPost />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
