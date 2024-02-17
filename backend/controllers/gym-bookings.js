import { Router } from "express";
import { validate } from "../middleware/validator.js";
import { Booking, create, update, deleteByID, getAll, getByID, getByUserID, gymBookingsInnerJoin, gymBookingsByUserID } from "../models/gym-bookings.js";
import auth from "../middleware/auth.js";

const bookingsController = Router()

const getBookingListSchema = {
    type: "object",
    properties: {}
}

bookingsController.get(
    "/gym-bookings",
    [
        auth(["manager", "member"]),
        validate({body: getBookingListSchema})
    ],
    async (req, res) => {
        const bookings = await getAll()

        res.status(200).json({
            status: 200,
            message: "booking list available here",
            bookings: bookings
        })
    }
)

const getInnerJoinListSchema = {
    type: "object",
    properties: {}
}

bookingsController.get(
    "/gym-booking-list",
    [
        auth(["manager", "trainer", "member"]),
        validate({ body: getInnerJoinListSchema })],
    async (req, res) => {
        const innerJoin = await gymBookingsInnerJoin()

        res.status(200).json({
            status: 200,
            message: "booking returned",
            bookings: innerJoin
        })
    }
)

const getUserBookingListSchema = {
    type: "object",
    properties: {}
}

bookingsController.get(
    "/user-booking-list",
    [
        auth(["member"]),
        validate({ body: getUserBookingListSchema })],
    async (req, res) => {
        console.log(req.user)
        const innerJoin = await gymBookingsByUserID(req.user.user_id)

        res.status(200).json({
            status: 200,
            message: "booking returned",
            bookings: innerJoin
        })
    }
)

const getBookingByIDSchema = {
    type: "object",
    properties: {
        id: {
            type: "string",
        }
    }
}

bookingsController.get(
    "/gym-bookings/:id", validate({ params: getBookingByIDSchema }),
    (req, res) => {
        const bookingID = req.params.id
        getByID(bookingID).then(booking => {
            res.status(200).json({
                status: 200,
                message: "Get booking by ID",
                booking: booking
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get booking by ID"
            })
        })
    }
)

const bookingByUserSchema = {
    type: "object",
    properties: {
        id: {
            type: "number",
        }
    }
}

bookingsController.get(
    "/gym-bookings/user-id/:id",
    validate({ params: bookingByUserSchema }),
    async (req, res) => {
        const userID = req.params.id

        const bookings = await getByUserID(userID)

        res.status(200).json({
            status: 200,
            message: "Get bookings by User ID",
            bookings: bookings,
        })
    }
)

const createBookingSchema = {
    type: "object",
    required: ["member_id", "trainer_booking_id"],
    properties: {
        member_id: {
            type: "string",
        },
        trainer_booking_id: {
            type: "number",
        }
    }
}

bookingsController.post(
    "/gym-bookings/", 
    validate({ body: createBookingSchema }),
    (req, res) => {

        const bookingData = req.body
        console.log(bookingData)

        const booking = Booking(
            null,
            bookingData.member_id,
            bookingData.trainer_booking_id
        )

        create(booking).then(createdBooking => {
            res.status(200).json({
                status: 200,
                message: "Booking created",
                booking: createdBooking,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to create booking" + error
            })
        })
    }
)

const updateBookingSchema = {
    type: "object",
    required: ["id"],
    properties: {
        booking_id: {
            type: "number",
        },
        member_id: {
            type: "string",
        },
        trainer_booking_id: {
            type: "string",
        }
    }
}

bookingsController.patch(
    "/gym-bookings/",validate({ body: updateBookingSchema }),
    (req, res) => {
        const bookingData = req.body
        const booking = Booking(
            bookingData.id,
            bookingData.member_id,
            bookingData.trainer_booking_id
        )
        update(booking)
            .then(updatedBooking => {
                res.status(200).json({
                    status: 200,
                    message: "Updated booking",
                    booking: updatedBooking,
                })
            })
    }
)

const deleteBookingSchema = {
    type: "object",
    required: ["booking_id"],
    properties: {
        booking_id: {
            type: "number"
        }
    }
}

bookingsController.delete(
    "/gym-bookings/",
    validate({ body: deleteBookingSchema }),
    (req, res) => {
        const bookingID = req.body.booking_id

        deleteByID(bookingID)
        .then(result => {
            res.status(200).json({
                status:200,
                message: "Deleted booking",
                result: result
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed!Check the controller" + error
            })
        })
    }
)

export default bookingsController