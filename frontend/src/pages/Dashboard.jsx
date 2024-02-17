import { useNavigate } from "react-router-dom";
import DashNav from "../components/DashNav";
import Footer from "../components/Footer";
import { useAuthentication } from "../hooks/authentication";

export default function Dashboard() {
    const [user, login, logout] = useAuthentication();
    const isManager = user.role === "manager";
    const isTrainer = user.role === "trainer";
    const isMember = user.role === "member";
    const navigate = useNavigate();
    return (
        <div>
            <DashNav />
            <main
                className="flex items-center justify-center h-screen bg-cover bg-center inset-0 bg-gray-300"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%) ,url('https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
            >
                <div className="absolute bg-gray-900 bg-opacity-80 rounded-xl h-auto max-h-2/3 pb-8">
                    <h1 className="text-zinc-200 text-xl lg:text-2xl xl:text-3xl px-4 lg:px-8 py-4 lg:py-6">
                        Welcome to your Dashboard,{" "}
                        {user ? user.firstname : "guest"}.
                    </h1>
                    <h2 className="text-zinc-200 text-center text-lg lg:text-xl xl:text-2xl mb-4">
                        You are a {user ? user.role : "unknown"}
                    </h2>
                    <div className="flex flex-col justify-center items-center mt-4">
                        <ul>
                            {(isMember || isTrainer) && (
                                <>
                                    <li className="flex flex-col justify-center items-center">
                                        <button
                                            onClick={() => {
                                                navigate("/personal");
                                            }}
                                            className="bg-zinc-200 w-48 text-primary uppercase font-semibold text-xl
                                    mb-2 px-6 py-2 rounded-xl hover:bg-purple-300 focus:outline-none
                                    active:bg-violet-500
                                    transform transition hover:-translate-y-0.5 hover:text-primary"
                                        >
                                            My Account
                                        </button>
                                    </li>
                                </>
                            )}
                            {isManager && (
                                <li className="flex flex-col justify-center items-center flex-wrap">
                                    <button
                                        onClick={() => {
                                            navigate("/users");
                                        }}
                                        className="bg-zinc-200 w-48 text-primary uppercase font-semibold text-xl
                                    mb-2 px-6 py-2 rounded-xl hover:bg-purple-300 focus:outline-none
                                    active:bg-violet-500
                                    transform transition hover:-translate-y-0.5 hover:text-primary"
                                    >
                                        Users
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate("/booking-user");
                                        }}
                                        className="bg-zinc-200 w-48 text-primary uppercase font-semibold text-xl
                                    mb-2 px-6 py-2 rounded-xl hover:bg-purple-300 focus:outline-none
                                    active:bg-
                                    transform transition hover:-translate-y-0.5 hover:text-primary"
                                    >
                                        Booked Users
                                    </button>
                                </li>
                            )}
                            {(isManager || isTrainer) && (
                                <li className="flex flex-col justify-center items-center flex-wrap">
                                    <button
                                        onClick={() => {
                                            navigate("/activities");
                                        }}
                                        className="bg-zinc-200 w-48 text-primary uppercase font-semibold text-xl
                                        mb-2 px-6 py-2 rounded-xl hover:bg-purple-300 focus:outline-none
                                        active:bg-
                                        transform transition hover:-translate-y-0.5 hover:text-primary"
                                    >
                                        Classes
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate("/booking-crud");
                                        }}
                                        className="bg-zinc-200 w-48 text-primary uppercase font-semibold text-xl
                                        mb-2 px-6 py-2 rounded-xl hover:bg-purple-300 focus:outline-none
                                        active:bg-
                                        transform transition hover:-translate-y-0.5 hover:text-primary"
                                    >
                                        Bookings
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate("/blog-crud");
                                        }}
                                        className="bg-zinc-200 w-48 text-primary uppercase font-semibold text-xl
                                        mb-2 px-6 py-2 rounded-xl hover:bg-purple-300 focus:outline-none
                                        active:bg-
                                        transform transition hover:-translate-y-0.5 hover:text-primary"
                                    >
                                        Blog
                                    </button>
                                </li>
                            )}
                            {isMember && (
                                <li className="flex flex-col justify-center items-center flex-wrap">
                                    <button
                                        onClick={() => {
                                            navigate("/blog");
                                        }}
                                        className="bg-zinc-200 w-48 text-primary uppercase font-semibold text-xl
                                        mb-2 px-6 py-2 rounded-xl hover:bg-purple-300 focus:outline-none
                                        active:bg-
                                        transform transition hover:-translate-y-0.5 hover:text-primary"
                                    >
                                        Blog
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate("/booking-list");
                                        }}
                                        className="bg-zinc-200 w-48 text-primary uppercase font-semibold text-xl
                                        mb-2 px-6 py-2 rounded-xl hover:bg-purple-300 focus:outline-none
                                        active:bg-
                                        transform transition hover:-translate-y-0.5 hover:text-primary"
                                    >
                                        Book a class
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate("/booking-user");
                                        }}
                                        className="bg-zinc-200 w-48 text-primary uppercase font-semibold text-xl
                                        mb-2 px-6 py-2 rounded-xl hover:bg-purple-300 focus:outline-none
                                        active:bg-
                                        transform transition hover:-translate-y-0.5 hover:text-primary"
                                    >
                                        {user.firstname}'s sessions
                                    </button>
                                </li>
                            )}
                            {(isManager || isTrainer || isMember) && (
                                <>
                                    <li className="flex flex-col justify-center items-center flex-wrap">
                                        <button
                                            onClick={logout}
                                            className="bg-primary w-48 text-zinc-200 uppercase font-semibold text-xl
                                    mb-2 px-6 py-2 rounded-xl hover:bg-purple-300 focus:outline-none
                                    active:bg-
                                    transform transition hover:-translate-y-0.5 hover:text-primary"
                                        >
                                            Logut
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
