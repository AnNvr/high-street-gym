import { useState, useEffect } from "react";
import { getAllUsers } from "../api/user.js";
import DashNav from "../components/DashNav.jsx";
import Footer from "../components/Footer.jsx";
import UserEdit from "../components/UserEdit.jsx";
import { useAuthentication } from "../hooks/authentication.jsx";

export default function Users() {
    const [user] = useAuthentication()

    const [refreshTrigger, setRefreshTrigger] = useState()
    const [selectedUserID, setSelectedUserID] = useState(null)

    // Load user list
    const [users, setUsers] = useState([])
    
    useEffect(() => {
        if (user.user_id && user.authentication_key) {
        getAllUsers(user.authentication_key)
            .then(users => {
                setUsers(users)
            })}

    }, [user.user_id, user.authentication_key, refreshTrigger])

    return <div className="bg-gray-50">
        <DashNav/>
        <div className="container mx-auto my-2 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg shadow border p-4 bg-white">
                <h2 className="text-xl font-semibold text-center mb-4">Users</h2>
                <div className="overflow-auto w-full">
                        <table className="w-full text-sm text-gray-700">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Select</th>
                                </tr>
                            </thead>
                            <tbody >
                                {users.map(user =>
                                    <tr key={user.user_id} className="border-b">
                                        <td className="px-6 py-4">
                                            {user.firstname} {user.lastname}
                                        </td>
                                        <td className="px-6 py-4">{user.role}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                        <button
                                            className="btn btn-sm btn-ghost hover:bg-blue-100 hover:text-blue-800 rounded"
                                            onClick={() => setSelectedUserID(user.user_id)}
                                        >Edit</button>
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                </div>
            </div>
            <div className="rounded-lg shadow border p-4 bg-white">
                <h2 className="text-xl font-semibold text-center mb-4">Edit User</h2>
                <UserEdit
                    userID={selectedUserID}
                    onSave={() => setRefreshTrigger({})}
                    allowEditRole={true} 
                />
            </div>
        </div >
        <Footer/>
    </div>
} 