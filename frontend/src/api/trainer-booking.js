import { API_URL } from "./api.js"

export async function getAllBookings(authenticationKey) {

    const response = await fetch(
        API_URL + "/bookings?authKey=" + authenticationKey,
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
        API_URL + "/booking-list?authKey=" + authenticationKey,
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

export async function getCreateBookingJoinList(authenticationKey) {
    
    const response = await fetch(
        API_URL + "/booking-create-list?authKey=" + authenticationKey,
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

export async function getUserBookings(userID) {
    // GET from the API /bookings/user-id/:id
    const response = await fetch(
        API_URL + "/booking/user-id/" + userID,
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

export async function getBookingByID(bookingID) {
    // GET frome the API /booking/:id
    const response = await fetch(
        API_URL + "/bookings/" + bookingID,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.booking
}

export async function createBooking(booking) {
    const response = await fetch(
        API_URL + "/bookings",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(booking)
        }
    )

    const postCreateBookingResponse = await response.json()

    return postCreateBookingResponse
}

export async function updateBooking(booking) {
    const response = await fetch(
        API_URL + "/bookings",
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(booking)
        }
    )

    const patchCreateBookingResponse = await response.json()

    return patchCreateBookingResponse
}



export async function deleteBooking(booking) {
    const response = await fetch(
        API_URL + "/bookings",
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        }
    )

    const deleteBookingResponse = await response.json()

    return deleteBookingResponse
}