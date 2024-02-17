import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication";

export default function Login() {
    const navigate = useNavigate()

    const [user, login, logout] = useAuthentication()

    const [statusMessage, setStatusMessage] = useState("")

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    function onLoginSubmit(e) {
        e.preventDefault()
        setStatusMessage("Logging in...")


        login(formData.email, formData.password)
            .then(result => {
                setStatusMessage("Login Successful!")
                navigate("/dashboard")
            })
            .catch(error => {
                setStatusMessage("login failed: " + error)
            })
    }

    return (
<div className="hero min-h-screen bg-opacity-50 bg-cover" style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%), url('https://images.unsplash.com/photo-1434847868581-86e8a2b8e7a3?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`}}>
    <div className="hero-content flex justify-center items-center">
        <form onSubmit={onLoginSubmit} className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-white bg-opacity-90">
            <div className="card-body">
                <h1 className="text-5xl font-bold text-center mb-6">Login now!</h1>
                <p className="text-center mb-6">
                    Welcome back! Please enter your details to sign in and
                    start your session.
                </p>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type="email"
                        placeholder="email"
                        className="input input-bordered w-full"
                        value={formData.email}
                        onChange={(e) => {
                            setFormData((prevForm) => {
                                return {
                                    ...prevForm,
                                    email: e.target.value,
                                };
                            });
                        }}
                    />
                </div>
                <div className="form-control mt-4">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="password"
                        className="input input-bordered w-full"
                        value={formData.password}
                        onChange={(e) => {
                            setFormData((prevForm) => {
                                return {
                                    ...prevForm,
                                    password: e.target.value,
                                };
                            });
                        }}
                    />
                    <label className="label mt-2">
                        <a
                            href="#"
                            className="label-text-alt link link-hover"
                        >
                            Forgot password?
                        </a>
                    </label>
                </div>
                <div className="form-control mt-6">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                    >
                        Login
                    </button>
                    <p className="mt-4 text-center">{statusMessage}</p>
                    <p className="mt-4 text-center">
                        <a
                            href="#"
                            className="link link-hover"
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            Go back
                        </a>
                    </p>
                </div>
            </div>
        </form>
    </div>
</div>

    )
}