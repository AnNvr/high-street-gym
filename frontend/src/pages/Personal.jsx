import { useState, useEffect } from "react";
import DashNav from "../components/DashNav";
import Footer from "../components/Footer";
import { useAuthentication } from "../hooks/authentication.jsx";
import { getAllUsers } from "../api/user";
import MemberEdit from "../components/MemberEdit";

export default function Personal () {
    const [user] = useAuthentication()
    const [authenticatedUser, setAuthenticatedUser] = useState(null); // State to hold the authenticated user
    const [refreshTrigger, setRefreshTrigger] = useState()

    // TO FIX: retrieve the details of the logged user and list them in a table
    useEffect(() => {
        if (user.user_id && user.authentication_key) {
        getAllUsers(user.authentication_key)
            .then(users => {
                const authenticatedUser = users.find(
                    (u) => u.user_id === user.user_id
                );
                setAuthenticatedUser(authenticatedUser)
            })}

    }, [user.user_id, user.authentication_key, refreshTrigger])
    return (<>
        <DashNav/>
        <div className="rounded border-2 border-primary p-2">

            <h2 className="text-center font-semibold">My Account</h2>
            <div className="overflow-x">
            {/* <table className="table table-compact w-full overflow-scroll">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {authenticatedUser.map(user =>
                        <tr key={user.user_id}>
                            <td>
                                {user.firstname} {user.lastname}
                            </td>
                            <td>{user.role}</td>
                            <td>{user.email}</td>
                        </tr>)}
                </tbody>
            </table> */}
            </div>
                <MemberEdit
                userID={user.user_id}
                allowEditRole={user.role === "manager"}
                onSave={() => setRefreshTrigger({})}
                />
        </div>
        <Footer />
    </>
    )
}