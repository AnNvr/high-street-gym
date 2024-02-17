import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication";
import { registerUser } from "../api/user.js";

export default function Register() {
    const navigate = useNavigate();

    const [user, login, logout] = useAuthentication();

    const [statusMessage, setStatusMessage] = useState("");

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        role: "member",
        password: "",
        phone: "",
        address: "",
    });

    function onRegisterSubmit(e) {
        e.preventDefault();
        setStatusMessage("Registering...");

        if (!/[A-Za-z]{1,32}/.test(formData.firstname)) {
            setStatusMessage("invalid firstname");
            return;
        }

        if (!/[A-Za-z]{1,32}/.test(formData.lastname)) {
            setStatusMessage("invalid firstname");
            return;
        }

        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/.test(formData.email)) {
            setStatusMessage("Invalid email address");
            return;
        }

        if (!/[a-zA-Z0-9]{6,24}/.test(formData.password)) {
            setStatusMessage("Invalid password");
            return;
        }

        if (
            !/^((?:[1-9][0-9 ().-]{5,28}[0-9])|(?:(00|0)( ){0,1}[1-9][0-9 ().-]{3,26}[0-9])|(?:(\+)( ){0,1}[1-9][0-9 ().-]{4,27}[0-9]))$/.test(
                formData.phone
            )
        ) {
            setStatusMessage("invalid phone number");
            return;
        }

        if (!/[0-9.\s\a-z]{1,30}/.test(formData.address)) {
            setStatusMessage("Invalid address");
            return;
        }
        // console.log(formData)
        // Register then attempt login
        registerUser(formData).then((result) => {
            setStatusMessage(result.message);
            login(formData.email, formData.password)
                .then((result) => {
                    setStatusMessage(result.message);
                    navigate("/dashboard");
                })
                .catch((error) => {
                    setStatusMessage("Login failed: " + error);
                });
        });
    }

    return (
        <div
            className="flex justify-evenly items-center w-full hero min-h-screen bg-opacity-50 bg-cover"
            style={{
                backgroundImage:
                    `linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%), url('https://images.unsplash.com/photo-1434754205268-ad3b5f549b11?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            }}
        >
            <form
                className="flex-grow m-4 max-w-lg shadow-lg rounded-lg bg-white bg-opacity-90 p-8"
                onSubmit={onRegisterSubmit}
            >
                <h1 className="text-4xl text-center mb-6">High Street Gym</h1>
                <h2 className="text-3xl text-center mb-6">Register Account</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">First Name:</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Jane"
                            className="input input-bordered"
                            value={formData.firstname}
                            onChange={(e) =>
                                setFormData((existing) => {
                                    return {
                                        ...existing,
                                        firstname: e.target.value,
                                    };
                                })
                            }
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Last Name:</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Doe"
                            className="input input-bordered"
                            value={formData.lastname}
                            onChange={(e) =>
                                setFormData((existing) => {
                                    return {
                                        ...existing,
                                        lastname: e.target.value,
                                    };
                                })
                            }
                        />
                    </div>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type="email"
                        placeholder="user@server.tld"
                        className="input input-bordered w-full"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData((existing) => {
                                return { ...existing, email: e.target.value };
                            })
                        }
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="password"
                        className="input input-bordered w-full"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData((existing) => {
                                return {
                                    ...existing,
                                    password: e.target.value,
                                };
                            })
                        }
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Phone</span>
                    </label>
                    <input
                        type="text"
                        placeholder="phone number"
                        className="input input-bordered w-full"
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData((existing) => {
                                return { ...existing, phone: e.target.value };
                            })
                        }
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Address</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Address"
                        className="input input-bordered w-full"
                        value={formData.address}
                        onChange={(e) =>
                            setFormData((existing) => {
                                return { ...existing, address: e.target.value };
                            })
                        }
                    />
                </div>
                <div className="flex  gap-4 items-center mt-6">
                    <button className="btn btn-primary">Register</button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/")}
                    >
                        Back
                    </button>
                </div>
                <p className="mt-2 text-center text-red-500">{statusMessage}</p>
            </form>
        </div>
    );
}
