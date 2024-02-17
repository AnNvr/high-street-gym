import { getInnerJoinList } from "../api/trainer-booking.js";
import { createBooking } from "../api/gym-bookings.js";
import DashNav from "../components/DashNav";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../hooks/authentication.jsx";

// This is the Page with the list of bookings available to the gym members
// The user select an existing booking, click on "Book" and confirm the booking in the database
export default function Bookings() {
    const [user] = useAuthentication();
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState("");
    // Load booking list
    const [joinList, setJoinList] = useState([]);

    useEffect(() => {
        if (user.user_id && user.authentication_key) {
        getInnerJoinList(user.authentication_key)
            .then(innerJoin => {
                setJoinList(innerJoin)
            })}

    }, [user.user_id, user.authentication_key])
    // useEffect(() => {
    //     getInnerJoinList()
    //         .then((innerJoin) => {
    //             // console.log(innerJoin)
    //             setJoinList(innerJoin);
    //         })
    //         .catch((error) => {
    //             // console.log(error)
    //         });
    // }, []);

    // important to pass the parameters member_id and trainer_bookings_id separately
    const handleBookingConfirmation = async (member_id, trainer_booking_id) => {
        // I build the booking object to be created passing the two parameters as properties
        const booking = {
            member_id: member_id,
            trainer_booking_id: trainer_booking_id,
        }
        await createBooking(booking);
        setStatusMessage("Booking Confirmed!");
        navigate("/booking-user");
    };

    return (
        <div className="bg-gray-50">
            <DashNav />
            <div className="container p-2 mx-auto">
                <div className="rounded border-2 border-primary p-2">
                    <div className="overflow-x-auto">
                        <table className="table table-compact w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Class</th>
                                    <th>Level</th>
                                    <th>Duration</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Trainer</th>
                                    <th>Book</th>
                                </tr>
                            </thead>
                            <tbody>
                                {joinList &&
                                    joinList.map((bookings) => (
                                        <tr key={bookings.trainer_booking_id}>
                                            <td>
                                                {bookings.trainer_booking_id}
                                            </td>
                                            <td>{bookings.name}</td>
                                            <td>{bookings.level}</td>
                                            <td>{bookings.duration}</td>
                                            <td>
                                                {new Date(
                                                    bookings.booking_date
                                                ).toLocaleDateString()}
                                            </td>
                                            <td>
                                                {bookings.booking_time}
                                            </td>
                                            <td>{bookings.firstname}</td>
                                            <td>
                                                <button
                                                    // send booking confirmation and store the booking in the db
                                                    onClick={() =>
                                                        // this function accepts member_id and trainer_booking_id as separate arguments
                                                        handleBookingConfirmation(
                                                            user.user_id,
                                                            bookings.trainer_booking_id
                                                        )
                                                    }
                                                    className="btn btn-primary btn-md"
                                                >
                                                    Book
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
    );
}
