import { db } from "../database.js"

//Model for trainer bookings
export function Booking(trainer_booking_id, booking_date, booking_time, location, trainer_user_id, activity_id) {
    return {
        trainer_booking_id,
        booking_date,
        booking_time,
        location,
        trainer_user_id,
        activity_id
    }
}

function innerJoinList(trainer_booking_id, booking_date, booking_time, location, name, level, duration, firstname) {
    return {
        trainer_booking_id,
        booking_date,
        booking_time,
        location,
        name,
        level,
        duration,
        firstname
    }
}

function createBookingJoinList(trainer_booking_id, booking_date, booking_time, location, firstname, lastname, name) {
    return {
        trainer_booking_id,
        booking_date,
        booking_time,
        location,
        firstname,
        lastname,
        name
    }
}

export async function getAll() {

    const [allBookingList] = await db.query("SELECT * FROM trainer_bookings")

    return allBookingList.map((result) => {
        return Booking(
            result.trainer_booking_id,
            result.booking_date,
            result.booking_time,
            result.location,
            result.trainer_user_id,
            result.activity_id,
        )
    })
}

// INNER JOIN
export async function trainerBookingsInnerJoin() {
    const [allInnerJoin] = await db.query(`SELECT 
        trainer_bookings.trainer_booking_id,
        trainer_bookings.booking_date,
        trainer_bookings.booking_time,
        trainer_bookings.location,
        activities.name,
        activities.level,
        activities.duration,
        users.firstname
        FROM
        trainer_bookings
        INNER JOIN activities ON trainer_bookings.activity_id = activities.activity_id
        INNER JOIN users ON trainer_bookings.trainer_user_id = users.user_id
        ORDER BY trainer_bookings.booking_date ASC, trainer_bookings.booking_time ASC;
        `)

        return allInnerJoin.map((result) => {
            return innerJoinList(
                result.trainer_booking_id,
                result.booking_date,
                result.booking_time,
                result.location,
                result.name,
                result.level,
                result.duration,
                result.firstname,
            )
        })
}

export async function createBookingsInnerJoin() {
    const [allInnerJoin] = await db.query(`SELECT 
    trainer_bookings.trainer_booking_id,
    trainer_bookings.booking_date,
    trainer_bookings.booking_time,
    trainer_bookings.location,
    activities.name,
    users.firstname,
    users.lastname
    FROM
    trainer_bookings
    INNER JOIN activities ON trainer_bookings.activity_id = activities.activity_id
    INNER JOIN users ON trainer_bookings.trainer_user_id = users.user_id
    ORDER BY trainer_bookings.booking_date ASC, trainer_bookings.booking_time ASC;
    `)

    return allInnerJoin.map((result) => {
        return createBookingJoinList(
            result.trainer_booking_id,
            result.booking_date,
            result.booking_time,
            result.location,
            result.name,
            result.firstname,
            result.lastname,
        )
    })
}

export async function getByID(bookingID) {
    
    const [bookingResults] = await db.query(
        "SELECT * FROM trainer_bookings WHERE trainer_booking_id = ?", bookingID
    )

    if (bookingResults.length > 0) {
        const bookingResult = bookingResults[0]
        return Promise.resolve(
            Booking(
                bookingResult.trainer_booking_id,
                bookingResult.booking_date,
                bookingResult.booking_time,
                bookingResult.location,
                bookingResult.trainer_user_id,
                bookingResult.activity_id,
            )
        )
    } else {
        return Promise.reject("No result found")
    }
}

// export async function getByUserID(userID) {
//     // Get a list of booking matching with a specific userID
//     const [bookingResults] = await db.query(
//         "SELECT * FROM trainer_bookings WHERE user_id = ?", userID
//     )
//     // Conver result into an object
//     return await bookingResults.map((result) => {
//         Booking(
//             result.trainer_booking_id,
//             result.booking_date,
//             result.booking_time,
//             result.location,
//             result.trainer_user_id,
//             result.activity_id
//         )
//     })
// }

export async function create(booking) {

    delete booking.trainer_booking_id

    return db.query(
        "INSERT INTO trainer_bookings (booking_date, booking_time, location, trainer_user_id, activity_id) VALUES (?, ?, ?, ?, ?)",
        [booking.booking_date, booking.booking_time, booking.location, booking.trainer_user_id, booking.activity_id]
    ).then(([result]) => {
        return {...booking, trainer_booking_id: result.insertId}
    })
}

export async function update(booking) {
    return db.query(
        `UPDATE trainer_bookings
            SET booking_date = ?,
                booking_time = ?,
                location = ?,
                trainer_user_id = ?,
                activity_id = ?
            WHERE trainer_booking_id = ?`,
        [
            booking.booking_date,
            booking.booking_time,
            booking.location,
            booking.trainer_user_id,
            booking.activity_id,
            booking.trainer_booking_id
        ]
    )
}

export async function deleteByID(bookingID) {
    return db.query("DELETE FROM trainer_bookings WHERE trainer_booking_id = ?", [bookingID])
}