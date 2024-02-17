import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication.jsx";

export default function DashNav() {
    const navigate = useNavigate();
    const [user, login, logout] = useAuthentication();

    // Define navigation items for each role
    const navConfig = {
        common: [{ label: "Dashboard", path: "/dashboard" }],
        manager: [
            { label: "Users", path: "/users" },
            { label: "Classes", path: "/activities" },
            { label: "Bookings", path: "/booking-crud" },
            { label: "Blog", path: "/blog-crud" },
        ],
        trainer: [
            { label: "Account", path: "/personal" },
            { label: "Classes", path: "/activities" },
            { label: "Bookings", path: "/booking-crud" },
            { label: "Blog", path: "/blog-crud" },
        ],
        member: [
            { label: "Account", path: "/personal" },
            { label: "Book a class", path: "/booking-list" },
            { label: "Booked sessions", path: "/booking-user" },
            { label: "Blog", path: "/blog" },
        ],
    };

    // Function to generate navigation items based on the user's role
    const getNavItems = (role) => {
        let items = [...navConfig.common]; // Start with common items
        if (navConfig[role]) {
            items = [...items, ...navConfig[role]]; // Add role-specific items
        }
        items.push({ label: "Logout", action: logout }); // Add logout action
        return items;
    };

    // Function to handle navigation or actions
    const handleItemClick = (item) => {
        if (item.action) {
            item.action(); // Execute action if exists
        } else {
            navigate(item.path); // Navigate to path
        }
    };

    // Render navigation items
    const navItems = getNavItems(user.role).map((item, index) => (
        <li key={index}>
            <a
                onClick={() => handleItemClick(item)}
                className="hover:bg-primary font-montserrat cursor-pointer"
            >
                {item.label}
            </a>
        </li>
    ));

    return (
        <div className="navbar bg-gray-900 flex justify-between items-center lg:items-stretch w-full">
            <div className="navbar-start lg:hidden">
                <div className="dropdown">
                    <label
                        tabIndex={0}
                        className="btn btn-ghost lg:hidden text-zinc-200 hover:bg-primary"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 w-52 font-montserrat uppercase"
                    >
                        {navItems}
                    </ul>
                </div>
            </div>

            <div className="navbar-center hidden lg:flex lg:flex-grow">
                <ul className="menu menu-horizontal p-0 text-zinc-100 flex justify-center w-full">
                    {navItems}
                </ul>
            </div>
        </div>
    );
}
