import { API_URL } from "./api";

// Login
export async function login(email, password) {
    const response = await fetch(API_URL + "/users/login", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const APIResponseObject = await response.json();

    return APIResponseObject;
}

// Logout
export async function logout(authenticationKey) {
    const response = await fetch(
        API_URL + "/users/logout", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ authenticationKey }),
    });

    const APIResponseObject = await response.json();

    return APIResponseObject;
}

// Authentication Key
export async function getByAuthenticationKey(authenticationKey) {
    const response = await fetch(
        API_URL + "/users/by-key/" + authenticationKey,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const APIResponseObject = await response.json();

    return APIResponseObject.user;
}

// Registration
export async function registerUser(user) {
    const response = await fetch(API_URL + "/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    const patchUserResult = await response.json();

    return patchUserResult;
}

// GET All
export async function getAllUsers(authenticationKey) {
    console.log("get all users")
    const response = await fetch(
        API_URL + "/users?authKey=" + authenticationKey,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const APIResponseObject = await response.json();

    return APIResponseObject.users;
}

// GET by ID
export async function getUserByID(userID, authenticationKey) {
    const response = await fetch(
        API_URL + "/users/" + userID + "?authKey=" + authenticationKey,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.user
}

// Create
export async function create(user, authenticationKey) {
    const response = await fetch(
        API_URL + "/users",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ user, authenticationKey })
        });
        
        const createUserResult = await response.json();

        return createUserResult;
}

// Update
export async function update(formData, user, authenticationKey) {
    const response = await fetch(
        API_URL + "/users", 
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({formData, user, authenticationKey}),
        }
    );

    const patchUserResult = await response.json();

    return patchUserResult;
}

// Delete
export async function deleteByID(userID, authenticationKey) {
    const response = await fetch(
        API_URL + "/users/" + userID, 
    {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({authenticationKey})
    });

    const deleteUserResponse = await response.json();

    return deleteUserResponse;
}

