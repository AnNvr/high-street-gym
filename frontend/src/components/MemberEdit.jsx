import { useState, useEffect } from "react"
import { getByAuthenticationKey, update } from "../api/user.js"
import { useAuthentication } from "../hooks/authentication.jsx"

export default function MemberEdit({ userID, onSave, allowEditRole }) {
    const [user] = useAuthentication()
    const [formData, setFormData] = useState({
        user_id: null,
        firstname: "",
        lastname: "",
        role: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        authentication_key: null,
    })
    const [statusMessage, setStatusMessage] = useState("")
    const [refreshTrigger, setRefreshTrigger] = useState()
    useEffect(() => {
        if (userID) {
            getByAuthenticationKey(user.authentication_key)
            .then(user => {
                setFormData(user)
            })
            .catch(error => {
                console.error(error)
            });
        }
    }, [user.authentication_key, refreshTrigger])

    //Updates user based on if the user has an ID or not yet
    function updateUser() {
        (formData.user_id)
            setStatusMessage("Updating user...")
            update(formData, user, user.authentication_key)
                .then(result => {
                    setStatusMessage(result.message)
                    setRefreshTrigger(prevTrigger => prevTrigger + 1);
                if (typeof onSave === "function") {
                    onSave()
                }
            })

    }

    return <div>
        <form className="flex-grow m-4 max-w-2xl mx-auto">

            <div className="form-control">
                <label className="label">
                    <span className="label-text">ID</span>
                </label>
                <input
                    type="text"
                    readOnly
                    className="input input-bordered w-1/4 text-lg"
                    value={formData.user_id}
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">First Name</span>
                </label>
                <input
                    type="text"
                    placeholder="Jane"
                    className="input input-bordered w-full text-lg"
                    value={formData.firstname}
                    onChange={(e) => setFormData(existing => { return { ...existing, firstname: e.target.value } })}
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Last Name</span>
                </label>
                <input
                    type="text"
                    placeholder="Doe"
                    className="input input-bordered w-full text-lg"
                    value={formData.lastname}
                    onChange={(e) => setFormData(existing => { return { ...existing, lastname: e.target.value } })}
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Role</span>
                </label>
                <select
                    className="select select-bordered text-lg"
                    value={formData.role}
                    onChange={(e) => setFormData(existing => { return { ...existing, role: e.target.value } })}
                    disabled={!allowEditRole}
                >
                    <option disabled selected>Pick one</option>
                    <option value="manager">Manager</option>
                    <option value="trainer">Trainer</option>
                    <option value="member">Member</option>
                </select>
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Email</span>
                </label>
                <input
                    type="email"
                    placeholder="user@server.tld"
                    className="input input-bordered w-full text-lg"
                    value={formData.email}
                    onChange={(e) => setFormData(existing => { return { ...existing, email: e.target.value } })}
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Password</span>
                </label>
                <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered w-full text-lg"
                    value={formData.password}
                    onChange={(e) => setFormData(existing => { return { ...existing, password: e.target.value } })}
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Phone</span>
                </label>
                <input
                    type="text"
                    placeholder="Phone"
                    className="input input-bordered w-full text-lg"
                    value={formData.phone}
                    onChange={(e) => setFormData(existing => { return { ...existing, phone: e.target.value } })}
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Address</span>
                </label>
                <input
                    type="string"
                    placeholder="Address"
                    className="input input-bordered w-full text-lg"
                    value={formData.address}
                    onChange={(e) => setFormData(existing => { return { ...existing, address: e.target.value } })}
                />
            </div>
            <div className="my-2 flex gap-2">
                <button
                    type="button"
                    onClick={() => updateUser()}
                    className="btn btn-primary mr-2 text-lg"
                    >
                        Update
                    </button>
                <label className="label">
                    <span className="label-text-alt">{statusMessage}</span>
                </label>
            </div>
        </form>
    </div>
}