import { useEffect, useState } from "react";
import {
    getAllActivities,
    getActivityByID,
    updateActivity,
} from "../api/activity.js";
import DashNav from "../components/DashNav.jsx";
import Footer from "../components/Footer.jsx";
import { XMLUpload } from "../components/XMLUpload.jsx";
import { createActivity } from "../api/activity.js";
import { deleteActivity } from "../api/activity.js";
import { useAuthentication } from "../hooks/authentication.jsx";

export default function Activities() {
    const [user] = useAuthentication();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [statusMessage, setStatusMessage] = useState("");
    const [selectedActivityID, setSelectedActivityID] = useState(null);
    const [formData, setFormData] = useState({
        activity_id: null,
        name: "",
        level: "",
        duration: "",
    });
    const [activities, setActivities] = useState([]);
    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        if (user.user_id && user.authentication_key) {
            getAllActivities(user.authentication_key).then((activities) => {
                setActivities(activities);
            });
        }
    }, [user.user_id, user.authentication_key, refreshTrigger]);

    useEffect(() => {
        if (selectedActivityID) {
            // If I have a selected Activity by ID, I want to get it using the selected activity by ID
            getActivityByID(selectedActivityID).then((activity) => {
                setFormData(activity);
            });
        } else {
            setFormData(formData);
        }
    }, [selectedActivityID]);

    function onSubmit(e) {
        e.preventDefault();
    }

    function createOrUpdateActivity() {
        if (selectedActivityID) {
            updateActivity(formData).then((updatedActivity) => {
                setSelectedActivityID(null);
                setFormData({
                    activity_id: null,
                    name: "",
                    level: "",
                    duration: "",
                });
                setRefreshTrigger((prevTrigger) => prevTrigger + 1);
            });
        } else {
            createActivity(formData).then((createdActivity) => {
                setSelectedActivityID(createdActivity.activity_id);
                setFormData({
                    activity_id: createdActivity.activity_id,
                    name: "",
                    level: "",
                    duration: "",
                });
                setRefreshTrigger((prevTrigger) => prevTrigger + 1);
            });
        }
    }

    function deletSelectedActivity() {
        deleteActivity(formData).then((result) => {
            setSelectedActivityID(null);
            setFormData({
                activity_id: "",
                name: "",
                level: "",
                duration: "",
            });
            setRefreshTrigger((prevTrigger) => prevTrigger + 1);
            setActivities((prevActivities) =>
                prevActivities.filter(
                    (activity) => activity.activity_id !== formData.activity_id
                )
            );
        });
    }

    /* return <>
        <DashNav />
        <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg shadow border p-4">
                <h2 className="text-xl text-center font-semibold mb-4">List of Activities</h2>
                <div className="overflow-x-auto">
                    <table className="table table-compact w-full">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="py-3 px-6">Name</th>
                                <th scope="col" className="py-3 px-6">Level</th>
                                <th scope="col" className="py-3 px-6">Duration</th>
                                <th scope="col" className="py-3 px-6">Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map(activity =>
                                <tr key={activity.activity_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="py-4 px-6">{activity.name}</td>
                                    <td className="py-4 px-6">{activity.level}</td>
                                    <td className="py-4 px-6">{activity.duration}</td>
                                    <td className="py-4 px-6">
                                    <button
                                            className="btn btn-sm btn-ghost my-1"
                                            onClick={() => setSelectedActivityID(activity.activity_id)}
                                            >Edit</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="rounded-lg shadow border p-4">
                <h2 className="text-center text-xl font-semibold mb-4">Upload Activities</h2>
                <XMLUpload
                    authenticationKey={user.authenticationKey}
                    onUploadSuccess={() => {
                    getAllActivities(user.authentication_key).then(activities => setActivities(activities))
                    }}/>
            </div>
        </div>

        <form className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4" onSubmit={onSubmit}>
            <div className="rounded-lg shadow border p-4">
                <h2 className="text-xl text-center font-semibold mb-4">Activity Form</h2>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">ID:</span>
                </label>
                <input
                    type="text"
                    readOnly
                    className="input input-bordered w-1/4"
                    value={formData.activity_id}
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Class name</span>
                </label>
                <input
                    type="text"
                    placeholder="Yoga"
                    className="input input-bordered w-full"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Level</span>
                </label>
                <input
                    type="text"
                    placeholder="easy, medium, hard"
                    className="input input-bordered w-full"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Duration</span>
                </label>
                <select
                    className="select select-bordered"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value})}
                >
                    <option value={null}>Pick one</option>
                    <option value="30mins">30mins</option>
                    <option value="45mins">45mins</option>
                    <option value="60mins">60mins</option>
                </select>
            </div>
            <div className="my-2 flex gap-2">
                <button
                    className="btn"
                    onClick={() => {
                        setFormData({activity_id: "", name: "", level: "", duration: ""})
                    }}
                    >New</button>
                <button
                    className="btn btn-primary"
                    onClick={() => createOrUpdateActivity()}
                    >Save</button>
                <button
                    className="btn btn-secondary"
                    onClick={() => deletSelectedActivity()}
                    >Delete</button>
                <label className="label-text-alt">
                    <span className="label-text-alt">{statusMessage}</span>
                </label>
            </div>
            </div>
        </form>
        <Footer />
    </> */

    return (
        <div className="bg-gray-50">
            <DashNav />
            <div className="container mx-auto p-4 space-y-8">
                <div className="flex flex-wrap justify-between items-center">
                    <h1 className="text-2xl font-semibold">
                        Activities Management
                    </h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowUpload(!showUpload)}
                    >
                        {showUpload
                            ? "Manage Activities"
                            : "Bulk Upload Activities"}
                    </button>
                </div>

                {/* Conditional Rendering for Upload Component or Activity List */}
                {showUpload ? (
                    <div className="rounded-lg shadow border p-4 bg-white">
                        <h2 className="text-xl text-center font-semibold mb-4">
                            Bulk Upload Activities
                        </h2>
                        <XMLUpload
                            authenticationKey={user.authenticationKey}
                            onUploadSuccess={() => {
                                getAllActivities(user.authentication_key).then(
                                    (activities) => setActivities(activities)
                                );
                            }}
                        />
                    </div>
                ) : (
                    <>
                        {/* Activities List */}
                        <div className="rounded-lg shadow border p-4 bg-white">
                            <h2 className="text-xl text-center font-semibold mb-4">
                                List of Activities
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="table table-compact w-full">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Level
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Duration
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Select
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activities.map((activity) => (
                                            <tr
                                                key={activity.activity_id}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            >
                                                <td className="py-4 px-6">
                                                    {activity.name}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {activity.level}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {activity.duration}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button
                                                        className="btn btn-sm btn-ghost my-1"
                                                        onClick={() =>
                                                            setSelectedActivityID(
                                                                activity.activity_id
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

                        {/* Activity Form */}
                        <form
                            className="rounded-lg shadow border p-4 bg-white"
                            onSubmit={onSubmit}
                        >
                            <h2 className="text-xl text-center font-semibold mb-4">
                                Activity Form
                            </h2>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">ID:</span>
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    className="input input-bordered w-1/4"
                                    value={formData.activity_id}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Class name
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Yoga"
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Level</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="easy, medium, hard"
                                    className="input input-bordered w-full"
                                    value={formData.level}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            level: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Duration</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.duration}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            duration: e.target.value,
                                        })
                                    }
                                >
                                    <option value={null}>Pick one</option>
                                    <option value="30mins">30mins</option>
                                    <option value="45mins">45mins</option>
                                    <option value="60mins">60mins</option>
                                </select>
                            </div>
                            <div className="my-2 flex gap-2">
                                <button
                                    className="btn"
                                    onClick={() => {
                                        setFormData({
                                            activity_id: "",
                                            name: "",
                                            level: "",
                                            duration: "",
                                        });
                                    }}
                                >
                                    New
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => createOrUpdateActivity()}
                                >
                                    Save
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => deletSelectedActivity()}
                                >
                                    Delete
                                </button>
                                <label className="label-text-alt">
                                    <span className="label-text-alt">
                                        {statusMessage}
                                    </span>
                                </label>
                            </div>
                        </form>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}
