import { Router } from "express";
import { validate } from "../middleware/validator.js";
import { Booking, create, update, getAll, getByID, deleteByID, trainerBookingsInnerJoin, createBookingsInnerJoin } from "../models/trainer-bookings.js";
import xml2js from "xml2js";
import auth from "../middleware/auth.js";

const bookingController = Router()

const getBookingListSchema = {
    type: "object",
    properties: {}
}

bookingController.get(
    "/bookings",
    [
        auth(["manager", "trainer"]),
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

bookingController.get(
    "/booking-list",
    [
        auth(["member"]),
        validate({body: getInnerJoinListSchema})
    ],
    async (req, res) => {
        const innerJoin = await trainerBookingsInnerJoin()
        
        res.status(200).json({
            status: 200,
            message: "list returned",
            bookings: innerJoin
        })
    }
)

const getCreateBookingInnerJoinSchema = {
    type: "object",
    properties: {}
}

bookingController.get(
    "/booking-create-list",
    [
        auth(["manager","trainer"]),
        validate({body: getCreateBookingInnerJoinSchema})
    ],
    async (req, res) => {
        const innerJoin = await createBookingsInnerJoin()

        res.status(200).json({
            status: 200,
            message: "list returned",
            bookings: innerJoin
        })
    }
)

const getBookingByIDSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
        }
    }
}

bookingController.get(
    "/bookings/:id", validate({ params: getBookingByIDSchema }),
    (req, res) => {
        const bookingID = req.params.id
        getByID(bookingID).then(booking => {
            res.status(200).json({
                status: 200,
                message: "Get booking by ID",
                booking: booking,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get booking by ID - " + error
            })
        })
    }
)

// XML upload endpoint
bookingController.post("/bookings/upload/xml", (req, res) => {
    if (req.files && req.files["xml-file"]) {
        // Access the XML file as a string
        const XMLFile = req.files["xml-file"]
        const file_text = XMLFile.data.toString()

        // Set up XML parser
        const parser = new xml2js.Parser()
        parser.parseStringPromise(file_text)
            .then(data => {
                const bookingUpload = data["booking-upload"]
                const bookingUploadAttributes = bookingUpload["$"]
                const operation = bookingUploadAttributes["operation"]
                // indexing to reach nested children
                const bookingsData = bookingUpload["bookings"][0]["booking"]

                if (operation == "insert") {
                    Promise.all(bookingsData.map((bookingData) => {
                        // Convert the xml object into a model object
                        const bookingModel = Booking(
                            null,
                            bookingData.booking_date.toString(),
                            bookingData.booking_time.toString(),
                            bookingData.location.toString(),
                            bookingData.trainer_user_id.toString(),
                            bookingData.activity_id.toString(),
                        )
                        // Return the promise of each creation query
                        return create(bookingModel)
                    })).then(results => {
                        res.status(200).json({
                            status: 200,
                            message: "XML Upload successful",
                        })
                    }).catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: "XML Upload failed on database operation - " + error,
                        })
                    })
                } else if (operation == "update") {
                    Promise.all(bookingsData.map((bookingData) => {
                        // Convert the xml object into a model object
                        const bookingModel = Booking(
                            bookingData.trainer_booking_id.toString(),
                            bookingData.booking_date.toString(),
                            bookingData.booking_time.toString(),
                            bookingData.location.toString(),
                            bookingData.trainer_user_id.toString(),
                            bookingData.activity_id.toString(),
                        )
                        // return the promise of each creation query
                        return update(bookingModel)
                    })).then(results => {
                        res.status(200).json({
                            status: 200,
                            message: "XML upload failed on database operation - " + error,
                        })
                    })
                } else {
                    res.status(400).json({
                        status: 400,
                        message: "XML contains invalid operation attribute values",
                    })
                }
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "Error parsing XML - " + error,
                })
            })
    } else {
        res.status(400).json({
            status: 400,
            message: "No file selected",
        })
    }
})

const bookingByUserSchema = {
    type: "object",
    properties: {
        id: {
            type: "number",
        }
    }
}

bookingController.get(
    "/booking/user-id/:id",
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
    required: ["booking_date", "booking_time", "location", "trainer_user_id", "activity_id"],
    properties: {
        booking_date: {
            type: "string",
        },
        booking_time: {
            type: "string",
        },
        location: {
            type: "string",
        },
        trainer_user_id: {
            type: "string",
        },
        activity_id: {
            type: "string",
        },
    }
}

bookingController.post(
    "/bookings/", validate({ body: createBookingSchema }),
    (req, res) => {

        const bookingData = req.body

        const booking = Booking(
            null,
            bookingData.booking_date,
            bookingData.booking_time,
            bookingData.location,
            bookingData.trainer_user_id,
            bookingData.activity_id,
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
                message: "Failed to create booking - " + error
            })
        })
    }
)

const updateBookingSchema = {
    type: "object",
    required: ["trainer_booking_id"],
    properties: {
        trainer_booking_id: {
            type: "number",
        },
        booking_date: {
            type: "string",
        },
        booking_time: {
            type: "string",
        },
        location: {
            type: "string",
        },
        trainer_user_id: {
            type: "number",
        },
        activity_id: {
            // type: "number",
            pattern: "[0-9]+"
        },
    },
}

bookingController.patch(
    "/bookings", validate({ body: updateBookingSchema }),
    (req, res) => {
        const bookingData = req.body
        console.log(bookingData)
        const booking = Booking(
            bookingData.trainer_booking_id,
            bookingData.booking_date,
            bookingData.booking_time,
            bookingData.location,
            bookingData.trainer_user_id,
            bookingData.activity_id,
        )
        update(booking)
            .then(updatedBooking => {
                res.status(200).json({
                    status: 200,
                    message: "Updated booking",
                    booking: updatedBooking,
                })
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to update booking - " + error
                })
            })
    }
)

const deleteBookingSchema = {
    type: "object",
    required: ["trainer_booking_id"],
    properties: {
        trainer_booking_id: {
            type: "number"
        }
    }
}

bookingController.delete(
    "/bookings",
    validate({ body: deleteBookingSchema }),
    (req, res) => {
        const bookingID = req.body.trainer_booking_id

        deleteByID(bookingID).then(result => {
            res.status(200).json({
                status:200,
                message: "Deleted booking",
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to delete booking" + error
            })
        })
    }
)

export default bookingController