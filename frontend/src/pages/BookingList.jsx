import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInnerJoinList, deleteBooking, getBookingsByLoggedUser } from "../api/gym-bookings.js";
import DashNav from "../components/DashNav";
import Footer from "../components/Footer";
import { useAuthentication } from "../hooks/authentication.jsx";

export default function BookingList() {
    const [user] = useAuthentication();
    const navigate = useNavigate()

    // TEST: INNER JOINT LIST
    const [joinList, setJoinList] = useState([]);
    useEffect(() => {
        if (user.user_id && user.authentication_key) {
            if(user.role === "member") {
                getBookingsByLoggedUser(user.authentication_key)
                .then(innerJoin => {
                    setJoinList(innerJoin)})
            } else {
                getInnerJoinList(user.authentication_key)
                    .then(innerJoin => {
                    setJoinList(innerJoin)
                })
            }
        }

    }, [user.user_id, user.authentication_key])

    // TEST: FILTER DATE AND TIME
    const [dateFilter, setDateFilter] = useState(""); // State variable for date filter
    const [timeFilter, setTimeFilter] = useState(""); // State variable for time filter

    const filteredBookings = joinList.filter(booking => {
        // Apply the date and time filters
        const bookingDate = new Date(booking.booking_date).toLocaleDateString();
        const bookingTime = booking.booking_time.toLowerCase();
        const dateMatches = dateFilter === "" || bookingDate.includes(dateFilter);
        const timeMatches = timeFilter === "" || bookingTime.includes(timeFilter.toLowerCase());
        return dateMatches && timeMatches;
    });

    // Delete
    const handleDeleteBooking = (bookingID) => {
        deleteBooking(bookingID)
            .then(() => {
                // Remove the deleted booking from the state
                setJoinList(joinList.filter((booking) => booking.booking_id !== bookingID))
            })
            .catch(error => {console.log(error)})
    }

    return <div className="bg-gray-50">
    <DashNav />
    <div className="container mx-auto h-screen">
        <button
            className="btn btn-sm btn-outline btn-primary mt-4 mb-2"
            onClick={() => navigate("/dashboard")}
        >
            Return to Dashboard
        </button>
        <div className="rounded border border-primary p-4">
            <div className="overflow-x-auto">
                {/* FILTERS */}
                <div className="flex flex-wrap items-center mb-4">
                    <label htmlFor="dateFilter" className="mr-2">
                        Date Filter:
                    </label>
                    <input
                        className="input input-bordered w-full md:w-auto"
                        type="text"
                        id="dateFilter"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        placeholder="YYYY-MM-DD"
                    />
                    <label htmlFor="timeFilter" className="ml-4 mr-2">
                        Time Filter:
                    </label>
                    <input
                        className="input input-bordered w-full md:w-auto"
                        type="text"
                        id="timeFilter"
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        placeholder="HH:MM"
                    />
                </div>
                {/* BOOKINGS TABLE */}
                <table className="table table-compact w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Booking #</th>
                            <th>Member</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map((booking) => (
                            <tr key={booking.booking_id}>
                                <td>{booking.booking_id}</td>
                                <td>{booking.trainer_booking_id}</td>
                                <td>{booking.firstname} {booking.lastname}</td>
                                <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                                <td>{booking.booking_time}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline btn-error"
                                        onClick={() => handleDeleteBooking(booking.booking_id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <Footer />
</div>

}