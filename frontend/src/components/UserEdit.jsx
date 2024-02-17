import { useState, useEffect } from "react"
import { deleteByID, getUserByID, update, create } from "../api/user.js"
import { useAuthentication } from "../hooks/authentication.jsx"

export default function UserEdit({ userID, onSave, allowEditRole }) {
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
            getUserByID(userID, user.authentication_key)
            .then(result => {
                setFormData(result)
            })
            .catch(error => {
                console.error(error)
            });
        }
    }, [userID])

    // Clears the currently loaded user data from the form
    function clear() {
        setFormData({
            user_id: "",
            firstname: "",
            lastname: "",
            role: "member",
            email: "",
            password: "",
            phone: "",
            address: "",
            authentication_key: null,
        })
        setStatusMessage("")
    }

    //Updates or Creates a new user based on if the user has an ID or not yet
    function createOrUpdateUser() {
        if (formData.user_id) {
            // The user in the form has an ID which implies they
            // already exist in the database. Therefore I update.
            setStatusMessage("Updating user...")
            update(formData, user, user.authentication_key)
                .then(result => {
                    setStatusMessage(result.message)

                if (typeof onSave === "function") {
                    onSave()
                }
            })
            setRefreshTrigger(prevTrigger => prevTrigger + 1);
        } else {
            // No ID? Let's create a new user!
            setStatusMessage("Creating user...")
            create(formData, user.authentication_key).then(result => {
                setStatusMessage(result.message)

                if(typeof onSave === "function") {
                    onSave()
                }

                setFormData((existing) => ({...existing, user_id: result.user.user_id}))
                setRefreshTrigger(prevTrigger => prevTrigger + 1);
            })
        }
    }

    // Delete the user
    function remove() {
        setStatusMessage("Deleting user...")
        deleteByID(formData.user_id, user.authentication_key)
            .then(result => {
                setStatusMessage(result.message)

                if (typeof onSave === "function") {
                    onSave()
                }

                clear()
            })
    }

    return <>
        <form className="flex-grow m-4 max-w-2xl">
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
                <input
                    type="button"
                    value={formData.user_id ? "Update" : "Insert"}
                    onClick={() => createOrUpdateUser()}
                    className="btn btn-primary mr-2 text-lg"
                    />
                <input
                    type="button"
                    disabled={!formData.user_id}
                    value="Remove"
                    onClick={() => remove()}
                    className="btn btn-secondary mr-2 text-lg"
                />
                <input
                    type="button"
                    value="Clear"
                    onClick={() => clear()}
                    className="btn btn-tertiary mr-2 text-lg"
                />

                <label className="label">
                    <span className="label-text-alt">{statusMessage}</span>
                </label>
            </div>
        </form>
    </>
}