import { createBrowserRouter } from "react-router-dom";
import { RestrictedRoute } from "./components/RestrictedRoute";
import Home from "./pages/Home";
import Gyms from "./pages/Gyms";
import AboutUs from "./pages/AboutUs";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Activities from "./pages/Activities";
import CRUDBookings from "./pages/CRUDBookings";
import Bookings from "./pages/Bookings";
import BookingList from "./pages/BookingList";
import CRUDBlog from "./pages/CRUDBlog";
import Blog from "./pages/Blog";
import Personal from "./pages/Personal";

const router = createBrowserRouter([
    {
        path:"/",
        element:<Home/>
    },
    {
        path: "/dashboard",
        element: <RestrictedRoute allowedRoles={["manager", "trainer", "member"]}>
            <Dashboard />
        </RestrictedRoute>
    },
    {
        path: "/gyms",
        element: <Gyms />
    },
    {
        path: "/about",
        element: <AboutUs />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },   
    {
        path:"/users",
        element: <RestrictedRoute allowedRoles={["manager"]}>
            <Users />
        </RestrictedRoute>
    },
    {
        path: "/activities",
        element: <RestrictedRoute allowedRoles={["manager", "trainer"]}>
            <Activities />
        </RestrictedRoute>
    },
    {
        path: "/booking-list",
        element: <RestrictedRoute allowedRoles={["member"]}>
            <Bookings />
        </RestrictedRoute>
    },
    {
        path: "/booking-crud",
        element: <RestrictedRoute allowedRoles={["manager", "trainer"]}>
            <CRUDBookings />
        </RestrictedRoute>
    },
    {
        path: "/blog-crud",
        element: <RestrictedRoute allowedRoles={["manager", "trainer"]}>
            <CRUDBlog />
        </RestrictedRoute>
    },
    {
        path: "/blog",
        element: <Blog />
    },
    {
        path: "/booking-user",
        element: <RestrictedRoute allowedRoles={["manager", "trainer", "member"]}>
                <BookingList />
            </RestrictedRoute>
    },
    {
        path: "/personal",
        element: <RestrictedRoute allowedRoles={["trainer", "member"]}>
                <Personal />
            </RestrictedRoute>
    },
])

export default router