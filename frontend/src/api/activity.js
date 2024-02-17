import { API_URL } from "./api.js"

export async function getAllActivities(authenticationKey) {
    const response = await fetch(API_URL + "/activities?authKey=" + authenticationKey)

    const getActivitiesResponse = await response.json()

    return getActivitiesResponse.activities
}

export async function getActivityByID(activityID) {
    const response = await fetch(
        API_URL+ "/activities/" + activityID,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
    )

    const getActivityByIdResponse = await response.json()

    return getActivityByIdResponse.activity
}

export async function createActivity(activity, authenticationKey) {
    const response = await fetch(
        API_URL + "/activities",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({...activity, authenticationKey})
        }
    )

    const postCreateActivityResponse = await response.json()

    return postCreateActivityResponse.activity
}

export async function updateActivity(activity, authenticationKey) {
    const response = await fetch(
        API_URL + "/activities",
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({...activity, authenticationKey})
        }
    )

    const patchCreateActivityResponse = await response.json()

    return patchCreateActivityResponse
}

export async function deleteActivity(activity, authenticationKey) {
    const response = await fetch(
        API_URL + "/activities",
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({...activity, authenticationKey})
        }
    )

    const deleteActivityResponse = await response.json()

    return deleteActivityResponse
}
