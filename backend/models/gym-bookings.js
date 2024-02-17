import { db } from "../database.js"

//Model for bookings
export function Booking(booking_id, member_id, trainer_booking_id) {
    return {
        booking_id,
        member_id,
        trainer_booking_id
    }
}
// Model for INNER JOIN
export function innerJoinList(booking_id, member_id, trainer_booking_id, booking_date, booking_time, firstname, lastname) {
    return {
        booking_id,
        member_id,
        trainer_booking_id,
        booking_date,
        booking_time,
        firstname,
        lastname,
    }
}

// INNER JOIN
export async function gymBookingsInnerJoin() {
    const [allInnerJoin] = await db.query(`SELECT
    bookings.booking_id,
    bookings.member_id,
    bookings.trainer_booking_id,
    trainer_bookings.booking_date,
    trainer_bookings.booking_time,
    users.firstname,
    users.lastname
    FROM
    bookings
    INNER JOIN trainer_bookings ON bookings.trainer_booking_id = trainer_bookings.trainer_booking_id
    INNER JOIN users ON bookings.member_id = users.user_id
    ORDER BY trainer_bookings.booking_date ASC, trainer_bookings.booking_time ASC;
    `)

    return allInnerJoin.map((result) => {
        return innerJoinList(
            result.booking_id,
            result.member_id,
            result.trainer_booking_id,
            result.booking_date,
            result.booking_time,
            result.firstname,
            result.lastname,
        )
    })
}

export async function gymBookingsByUserID(userID) {
    const [allInnerJoin] = await db.query(`SELECT
    bookings.booking_id,
    bookings.member_id,
    bookings.trainer_booking_id,
    trainer_bookings.booking_date,
    trainer_bookings.booking_time,
    users.firstname,
    users.lastname
    FROM
    bookings
    INNER JOIN trainer_bookings ON bookings.trainer_booking_id = trainer_bookings.trainer_booking_id
    INNER JOIN users ON bookings.member_id = users.user_id
    WHERE bookings.member_id = ?
    ORDER BY trainer_bookings.booking_date ASC, trainer_bookings.booking_time ASC;
    `, [userID])

    return allInnerJoin.map((result) => {
        return innerJoinList(
            result.booking_id,
            result.member_id,
            result.trainer_booking_id,
            result.booking_date,
            result.booking_time,
            result.firstname,
            result.lastname,
        )
    })
}

export async function getAll() {

    const [allBookingList] = await db.query("SELECT * FROM bookings")

    return allBookingList.map((result) => {
        return Booking(
            result.booking_id,
            result.member_id,
            result.trainer_booking_id
        )
    })
}

export async function getByID(bookingID) {
    
    const [bookingResults] = await db.query(
        "SELECT * FROM bookings WHERE booking_id = ?", bookingID
    )

    if (bookingResults.length > 0) {
        const result = bookingResults[0]
        return Promise.resolve(
            Booking(
                result.booking_id,
                result.member_id,
                result.trainer_booking_id
            )
        )
    } else {
        return Promise.reject("No result found")
    }
}

export async function getByUserID(memberID) {
    // Get a list of booking matching with a specific userID
    const [bookingResults] = await db.query(
        "SELECT * FROM bookings WHERE member_id = ?", memberID
    )
    // Conver result into an object
    return await bookingResults.map((result) => {
        Booking(
            result.booking_id,
            result.member_id,
            result.trainer_booking_id
        )
    })
}

export async function create(booking) {

    delete booking.booking_id

    return db.query(
        "INSERT INTO bookings (member_id, trainer_booking_id) VALUES (?, ?)",
        [booking.member_id, booking.trainer_booking_id]
    ).then(([result]) => {
        return {...booking, booking_id: result.insertId}
    })
}

export async function update(booking) {
    return db.query(
        "UPDATE bookings SET member_id = ?, trainer_booking_id = ? WHERE booking_id = ?",
        [booking.member_id, booking.trainer_booking_id]
    )
}

export async function deleteByID(bookingID) {
    return db.query("DELETE FROM bookings WHERE booking_id = ?", [bookingID])
}