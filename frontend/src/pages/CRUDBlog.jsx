import { useEffect, useState } from "react";
import {
    getBlogByID,
    // getAllBlog,
    createBlog,
    updateBlog,
    deleteBlogByID,
    getInnerJoinList,
} from "../api/blog.js";
import DashNav from "../components/DashNav.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication.jsx";
import { getByAuthenticationKey } from "../api/user.js";

export default function CRUDBlog() {
    const [user] = useAuthentication();
    // The authenticated user is retrivied and displayed in the user_id field
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        getByAuthenticationKey(user.authentication_key).then((user) => {
            setUserData(user);
        });
    }, [user.authentication_key]);

    useEffect(() => {
        if (userData) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                user_id: userData.user_id,
            }));
        }
    }, [userData]);

    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState("");
    const [selectedBlogID, setSelectedBlogID] = useState(null);
    const [formData, setFormData] = useState({
        blog_id: null,
        title: "",
        date: "",
        content: "",
        user_id: "",
    });

    // TEST: fetch the blog posts list from the backend when component loads
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [joinList, setJoinList] = useState([]);
    useEffect(() => {
        if (user.user_id && user.authentication_key) {
            getInnerJoinList(user.authentication_key).then((blog) => {
                setJoinList(blog);
            });
        }
    }, [user.user_id, user.authentication_key, refreshTrigger]);

    useEffect(() => {
        if (selectedBlogID) {
            getBlogByID(selectedBlogID).then((blog) => {
                setFormData(blog);
            });
        } else {
            setFormData(formData);
        }
    }, [selectedBlogID]);

    function onSubmit(e) {
        console.log("onSubmit");
        e.preventDefault();
    }

    // Create/Update a post
    function createOrUpdateBlog() {
        if (selectedBlogID) {
            updateBlog(formData, user.authentication_key).then(
                (updatedBlog) => {
                    setSelectedBlogID(null);
                    setFormData({
                        blog_id: null,
                        title: "",
                        date: "",
                        content: "",
                        user_id: "",
                    });
                    setRefreshTrigger((prevTrigger) => prevTrigger + 1); // Update refreshTrigger to trigger the effect
                }
            );
        } else {
            const currentDate = new Date().toISOString(); // ...It should generate the current date?

            createBlog(
                { ...formData, date: currentDate },
                user.authentication_key
            ).then((createdBlog) => {
                setFormData({
                    blog_id: null,
                    title: "",
                    content: "",
                    user_id: user.user_id || "",
                });
                setSelectedBlogID(null);
                setRefreshTrigger((prevTrigger) => prevTrigger + 1);
            });
        }
    }

    // Delete a post
    function deleteSelectedBlog() {
        deleteBlogByID(formData, user.authentication_key).then((result) => {
            setSelectedBlogID(null);
            setFormData({
                blog_id: "",
                title: "",
                date: "",
                content: "",
                user_id: user.user_id,
            });
            setRefreshTrigger((prevTrigger) => prevTrigger + 1); // Update refreshTrigger to trigger the effect
        });
    }

    return (
        <div className="bg-gray-50">
            <DashNav />
            <div className="container mx-auto p-4 grid grid-cols-1 gap-4">
                <div className="rounded-lg shadow border p-4 bg-white">
                    <h2 className="text-xl text-center font-bold mb-4">
                        Blog List
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Title
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Select
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {joinList.map((blog) => (
                                    <tr
                                        key={blog.blog_id}
                                        className="bg-white border-b hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            {blog.blog_id}
                                        </td>
                                        <td className="px-6 py-4">
                                            {blog.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(
                                                blog.date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {blog.firstname} {blog.lastname}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="btn btn-sm btn-ghost"
                                                onClick={() =>
                                                    setSelectedBlogID(
                                                        blog.blog_id
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <form
                className="container mx-auto p-4 grid grid-cols-1 gap-4"
                onSubmit={onSubmit}
            >
                <div className="rounded-lg shadow border p-4 bg-white">
                    <h2 className="text-xl text-center font-bold mb-4">
                        Blog Form
                    </h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">ID:</span>
                        </label>
                        <input
                            type="text"
                            readOnly
                            className="input input-bordered w-full max-w-xs"
                            value={formData.blog_id}
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Title:</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Title"
                            className="input input-bordered w-full"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                        />
                    </div>

                    <label className="label">
                        <span className="label-text">Content:</span>
                    </label>
                    <textarea
                        type="text"
                        className="textarea textarea-bordered w-full"
                        value={formData.content}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                content: e.target.value,
                            })
                        }
                    />
                    <div>
                        <label className="label">
                            <span className="label-text">User</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full max-w-xs"
                            value={formData.user_id}
                            readOnly
                        />
                    </div>
                    <div className="pt-2 flex gap-2">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setFormData({
                                    blog_id: "",
                                    title: "",
                                    date: "",
                                    content: "",
                                    user_id: user.user_id,
                                });
                            }}
                        >
                            New
                        </button>
                        <button
                            className="btn"
                            onClick={() => createOrUpdateBlog()}
                        >
                            Save
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => deleteSelectedBlog()}
                        >
                            Delete
                        </button>
                        <button
                            className="btn btn-info"
                            onClick={() => {
                                navigate("/blog");
                            }}
                        >
                            Blog Page
                        </button>
                        <label className="label-text-alt">
                            <span className="label-text-alt">
                                {statusMessage}
                            </span>
                        </label>
                    </div>
                </div>
            </form>
            <Footer />
        </div>
    );
}
