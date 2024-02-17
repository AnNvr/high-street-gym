import { useState, useEffect } from "react";
import { getBookingByID, updateBooking } from "../api/trainer-booking";

export default function BookingEdit({ bookingID, onSave }) {
    const [ formData, setFormData] = useState({
        id: null,
        booking_date: "",
        booking_time: "",
        location: "",
        trainer_user_id: "",
        activity_id: "",
    })
    const [statusMessage, setStatusMessage] = useState("")

    useEffect(() => {
        if (bookingID) {
            getBookingByID(bookingID).then(booking => {
                setFormData(booking)
            })
        }
    }, [bookingID])

    function saveBooking(e) {
        e.preventDefault()
        setStatusMessage("Saving...")
        updateBooking(formData).then(result => {
            setStatusMessage(result.message)

            if (typeof onSave === "function") {
                onSave()
            }
        })
    }

    return <>
        <form className="flex-grow m-4 max-w-2xl" onSubmit={saveBooking} >
            <div className="form-control">
                <label className="label">
                    <span className="label-text">ID</span>
                </label>
                <input
                    type="text"
                    readOnly
                    className="input input-bordered w-full"
                    value={formData.id}
                />
            </div>

            <div className="form-control">
                <label className="label">
                    <span className="label-text">Date</span>
                </label>
                <input
                    type="datetime-local"
                    className="input input-bordered w-full"
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
                <select
                    className="select select-bordered"
                    value={formData.booking_time}
                    onChange={(e) => setFormData(existing => { return { ...existing, booking_time: e.target.value } })}
                >
                    <option disabled selected>Pick one</option>
                    <option value="6:00">6:00</option>
                    <option value="12:00">12:00</option>
                    <option value="18:00">18:00</option>
                </select>
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Location</span>
                </label>
                <input
                    type="text"
                    placeholder="user@server.tld"
                    className="input input-bordered w-full"
                    value={formData.location}
                    onChange={(e) => setFormData(existing => { return { ...existing, location: e.target.value } })}
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Trainer</span>
                </label>
                <input
                    type="text"
                    placeholder="trainer"
                    className="input input-bordered w-full"
                    value={formData.trainer_user_id}
                    onChange={(e) => setFormData(existing => { return { ...existing, trainer_user_id: e.target.value } })}
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Activity</span>
                </label>
                <input
                    type="text"
                    placeholder="activity"
                    className="input input-bordered w-full"
                    value={formData.activity_id}
                    onChange={(e) => setFormData(existing => { return { ...existing, activity_id: e.target.value } })}
                />
            </div>
            
            <div className="my-2 flex gap-2">
                <button className="btn btn-primary mr-2" >Save</button>
                <button
                    onClick={() => deleteUser()}
                    className="btn btn-secondary mr-2" >Delete</button>
                <label className="label">
                    <span className="label-text-alt">{statusMessage}</span>
                </label>
            </div>
        </form>
    </>
}