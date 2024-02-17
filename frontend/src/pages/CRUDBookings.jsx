import { useState, useEffect } from "react";
import DashNav from "../components/DashNav";
import Footer from "../components/Footer";
import { XMLBookingUpload } from "../components/XMLBookingUpload";
import {
    getAllBookings,
    getBookingByID,
    updateBooking,
    createBooking,
    deleteBooking,
    getCreateBookingJoinList,
} from "../api/trainer-booking.js";
import { useAuthentication } from "../hooks/authentication.jsx";
import { getAllUsers } from "../api/user";
import { getAllActivities } from "../api/activity";

export default function CRUDBookings() {
    const [user] = useAuthentication()
    const [statusMessage, setStatusMessage] = useState("");
    const [selectedBookingID, setSelectedBookingID] = useState(null);
    const [formData, setFormData] = useState({
        id: null,
        booking_date: "",
        booking_time: "",
        location: "",
        name: "",
        firstname: "",
        lastname: "",
    });
    const [bookings, setBookings] = useState([]);
    // TEST: FILTER DATE AND TIME
    const [dateFilter, setDateFilter] = useState(""); // State variable for date filter
    const [timeFilter, setTimeFilter] = useState(""); // State variable for time filter
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const filteredBookings = bookings.filter(booking => {
        // Apply the date and time filters
        const bookingDate = new Date(booking.booking_date).toLocaleDateString();
        const bookingTime = booking.booking_time.toLowerCase();
        const dateMatches = dateFilter === "" || bookingDate.includes(dateFilter);
        const timeMatches = timeFilter === "" || bookingTime.includes(timeFilter.toLowerCase());
        return dateMatches && timeMatches;
    });


    // Load the list
    useEffect(() => {
        if (user.user_id && user.authentication_key) {
        getCreateBookingJoinList(user.authentication_key)
            .then(bookings => {
                setBookings(bookings)
            })}
    }, [user.user_id, user.authentication_key, refreshTrigger])

    useEffect(() => {
        if (selectedBookingID) {
            getBookingByID(selectedBookingID).then((booking) => {
                setFormData(booking);
            });
        } else {
            setFormData(formData);
        }
    }, [selectedBookingID]);

    // The following state will load the trainers from the user list
    const [trainers, setTrainers] = useState([])
    useEffect(() => {
        getAllUsers(user.authentication_key).then(users => {
            setTrainers(users.filter(user => user.role == "trainer"))
        })
    }, [])

    // The following state will load the activities from the activity list
    const [activities, setActivities] = useState([])
    useEffect(() => {
        getAllActivities(user.authentication_key).then(activities => {
            setActivities(activities)
        })
    }, [])

    function onSubmit(e) {
        e.preventDefault();
    }

    function createOrUpdateBooking() {
        if (selectedBookingID) {
            updateBooking(formData).then((updatedBooking) => {
                setSelectedBookingID(null);
                setFormData({
                    trainer_booking_id: "",
                    booking_date: "",
                    booking_time: "",
                    location: "",
                    name: "",
                    firstname: "",
                    lastname: "",
                });
                setRefreshTrigger(prevTrigger => prevTrigger + 1); // Update refreshTrigger to trigger the effect
            });
        } else {
            createBooking(formData).then((createdBooking) => {
                const id = createdBooking.trainer_booking_id;
                setSelectedBookingID(id);
                setFormData({
                    trainer_booking_id: "",
                    booking_date: "",
                    booking_time: "",
                    location: "",
                    name: "",
                    firstname: "",
                    lastname: "",
                });
                setRefreshTrigger(prevTrigger => prevTrigger + 1); // Update refreshTrigger to trigger the effect
            });
        }
    }

    function deleteSelectedBooking() {
        deleteBooking(formData).then((result) => {
            setSelectedBookingID(null);
            setFormData({
                trainer_booking_id: "",
                booking_date: "",
                booking_time: "",
                location: "",
                name: "",
                firstname: "",
                lastname: "",
            });
            setRefreshTrigger(prevTrigger => prevTrigger + 1); // Update refreshTrigger to trigger the effect
        });
    }

    return (
        <div className="bg-gray-50">
            <DashNav />
            <div className="container mx-auto p-4">
                <div className="rounded-lg shadow border p-4 bg-white">
                    <h2 className="text-xl font-semibold text-center mb-4">Bookings Management</h2>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 md:mb-0">Filter Bookings</h3>
                            <div className="flex gap-4 flex-wrap">
                                <div>
                                    <label className="label" htmlFor="dateFilter">
                                        <span className="label-text">Filter by Day:</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="dateFilter"
                                        className="input input-bordered"
                                        value={dateFilter}
                                        onChange={e => setDateFilter(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="label" htmlFor="timeFilter">
                                        <span className="label-text">Filter by Time:</span>
                                    </label>
                                    <input
                                        type="time"
                                        id="timeFilter"
                                        className="input input-bordered"
                                        value={timeFilter}
                                        onChange={e => setTimeFilter(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            
                        <XMLBookingUpload
                        onUploadSuccess={() => {
                            getAllBookings(user.authentication_key).then((bookings) =>
                                setBookings(bookings)
                            );
                        }}
                    />
                        </div>
                    </div>


                    <div className="overflow-x-auto">
                        <table className="table table-compact w-full">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">ID</th>
                                    <th scope="col" className="px-6 py-3">Activity</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Time</th>
                                    <th scope="col" className="px-6 py-3">Location</th>
                                    <th scope="col" className="px-6 py-3">Trainer</th>
                                    <th scope="col" className="px-6 py-3">Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.trainer_booking_id} className="border-b">
                                        <td className="px-6 py-4">{booking.trainer_booking_id}</td>
                                        <td className="px-6 py-4">{booking.firstname}</td>
                                        <td className="px-6 py-4">
                                            {new Date(
                                                booking.booking_date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">{booking.booking_time}</td>
                                        <td className="px-6 py-4">{booking.location}</td>
                                        <td className="px-6 py-4">{booking.lastname} {booking.name}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="btn btn-sm btn-ghost my-1"
                                                onClick={() =>
                                                    setSelectedBookingID(
                                                        booking.trainer_booking_id
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

                {/* <div className="rounded-lg shadow border p-4 bg-white">
                    <h2 className="text-xl font-semibold text-center mb-4">Booking Filter</h2>
                    <div className="flex justify-center">

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Filter by Day:</span>
                        </label>
                        <input
                            className="input input-bordered w-1/2 mx-2 my-2"
                            type="text"
                            id="dateFilter"
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Filter by Time:</span>
                        </label>
                        <input
                            className="input input-bordered w-1/2 mx-2 my-2"
                            type="text"
                            id="timeFilter"
                            value={timeFilter}
                            onChange={e => setTimeFilter(e.target.value)}
                        />
                    </div>
                    </div>
                </div> */}
                
{/*                 <div className="rounded-lg shadow border p-4 bg-white min-h-16">
                    <h2 className="text-xl font-semibold text-center mb-4">Upload Booking</h2>
                    <XMLBookingUpload
                        onUploadSuccess={() => {
                            getAllBookings(user.authentication_key).then((bookings) =>
                                setBookings(bookings)
                            );
                        }}
                    />
                </div> */}
            </div>

            <form
                className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4"
                onSubmit={onSubmit}
            >
                <div className="rounded-lg shadow border p-4 bg-white">
                    <h2 className="text-xl font-semibold text-center mb-4">Booking Form</h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">ID:</span>
                        </label>
                        <input
                            type="text"
                            readOnly
                            className="input input-bordered w-1/4"
                            value={formData.trainer_booking_id}
                        />
                    </div>

                    {/* <div className="form-control">
                        <label className="label">
                            <span className="label-text">Activity ID:</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-1/4"
                            value={formData.activity_id}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    activity_id: e.target.value,
                                })
                            }
                        />
                    </div> */}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Activity</span>
                        </label>
                        <select
                            className="collapse collpase-arrow border border-base-300 w-1/2 p-3 rounded-lg bg-white"
                            value={formData.activity_id} onChange={(e) => setFormData({ ...formData, activity_id: e.target.value })}>
                            <option value="" selected disabled>Select Activity</option>
                            {activities.map(activity =>
                                <option value={activity.activity_id}>
                                    {activity.name}
                                </option>
                            )}
                        </select>
                    </div>
                    
                    {/* <div className="form-control">
                        <label className="label">
                            <span className="label-text">Activity:</span>
                        </label>
                        <select
                            className="select select-bordered w-1/4"
                            value={formData.activity_id}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    activity_id: e.target.value,
                                })
                            }
                        >
                            <option value="">Select Activity</option>
                            {activities.map((activity) => (
                                <option key={activity.id} value={activity.id}>
                                    {activity.name}
                                </option>
                            ))}
                        </select>
                    </div> */}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Date</span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered w-1/2"
                            value={formData.booking_date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    booking_date: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Time</span>
                        </label>
                        <input
                            type="time"
                            className="input input-bordered w-1/4"
                            value={formData.booking_time}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    booking_time: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Location</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-1/2"
                            value={formData.location}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    location: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Trainer</span>
                        </label>
                        <select
                            className="collapse collpase-arrow border border-base-300 w-1/2 p-3 rounded-lg bg-white"
                            value={formData.trainer_user_id} onChange={(e) => setFormData({ ...formData, trainer_user_id: e.target.value })}>
                            <option value="" selected disabled>Select Trainer</option>
                            {trainers.map(trainer =>
                                <option value={trainer.user_id}>
                                    {trainer.firstname} {trainer.lastname}
                                </option>
                            )}
                        </select>
                    </div>

                    {/* <div className="form-control">
                        <label className="label">
                            <span className="label-text">Trainer ID</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-1/4"
                            value={formData.trainer_user_id}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    trainer_user_id: e.target.value,
                                })
                            }
                        />
                    </div> */}

                    <div className="my-2 flex gap-2">
                        <button
                            className="btn"
                            onClick={() => {
                                setFormData({
                                    trainer_booking_id: "",
                                    booking_date: "",
                                    booking_time: "",
                                    location: "",
                                    trainer_user_id: "",
                                    activity_id: "",
                                });
                            }}
                        >
                            New
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => createOrUpdateBooking()}
                        >
                            Save
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => deleteSelectedBooking()}
                        >
                            Delete
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
