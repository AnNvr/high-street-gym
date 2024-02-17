import { useNavigate } from "react-router-dom";

export default function Navbar({ userRole }) {
    const navigate = useNavigate()
    return (
        <nav className="navbar bg-gray-900">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden text-zinc-200 hover:bg-primary">
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
                        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 font-montserrat uppercase"
                    >
                        <li>
                            <a 
                                onClick={() => {navigate("/gyms")}}
                                className="hover:bg-primary hover:text-zinc-100 hover:font-bold"
                                >Gyms</a>
                        </li>
                        <li>
                            <a 
                                onClick={() => {navigate("/about")}}
                                className="hover:bg-primary hover:text-zinc-100"
                                >About Us</a>
                        </li>
                    </ul>
                </div>
                <a 
                    onClick={() => {navigate("/")}}
                    className="btn btn-ghost ml-2 pt-2 normal-case text-xl text-zinc-100 hover:bg-primary font-montserrat hidden sm:block">HIGH STREET GYM</a>
            </div>
            <div className="navbar-end w-full">
            <div className="navbar-end hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-zinc-100 flex">
                    <li>
                        <a 
                            onClick={() => {navigate("/gyms")}}
                            className="hover:bg-primary font-montserrat">Gyms</a>
                    </li>
                    <li>
                        <a 
                            onClick={() => {navigate("/about")}}
                            className="hover:bg-primary font-montserrat">About Us</a>
                    </li>
                </ul>
            </div>
                <a 
                    onClick={() => {navigate("/login")}}
                    className="btn btn-outline border-zinc-100 border-2 mr-2 text-zinc-100 hover:border-zinc-100 hover:bg-slate-600 font-montserrat">Login</a>
                <a 
                    onClick={() => {navigate("/register")}}
                    className="btn btn-primary font-montserrat">Join Us</a>
            </div>
        </nav>
    );
}
