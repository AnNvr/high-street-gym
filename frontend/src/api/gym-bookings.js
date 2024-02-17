import { API_URL } from "./api.js"

export async function getAllBookings(authenticationKey) {
    const response = await fetch(
        API_URL + "/gym-bookings?authKey=" + authenticationKey,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.bookings
}

export async function getInnerJoinList(authenticationKey) {
    
    const response = await fetch(
        API_URL + "/gym-booking-list?authKey=" + authenticationKey,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.bookings
}

export async function getBookingsByLoggedUser(authenticationKey) {
    
    const response = await fetch(
        API_URL + "/user-booking-list?authKey=" + authenticationKey,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.bookings
}

export async function createBooking(bookingData) {

    const response = await fetch(
        API_URL + "/gym-bookings",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(bookingData)
        }
    )

    const postCreateBookingResponse = await response.json()

    return postCreateBookingResponse
}



export async function deleteBooking(bookingID) {
    const response = await fetch(
        API_URL + "/gym-bookings",
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({booking_id: bookingID})
        }
    )

    const deleteBookingResponse = await response.json()

    return deleteBookingResponse
}