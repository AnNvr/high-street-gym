import { db } from "../database.js"

// Model for users
export function User(
    user_id,
    firstname,
    lastname,
    role,
    email,
    password,
    phone,
    address,
    authentication_key,
) {
    return {
        user_id,
        firstname,
        lastname,
        role,
        email,
        password,
        phone,
        address,
        authentication_key,
    }
}

// GET all
export async function getAll() {
    const [allUsers] = await db.query("SELECT * FROM users")
    return allUsers.map((result) => {
        return User(
            result.user_id.toString(),
            result.firstname,
            result.lastname,
            result.role,
            result.email,
            result.password,
            result.phone,
            result.address,
            result.authentication_key,
        )
    })
}

// by ID
export async function getByID(userID) {
    const [userByID] = await db.query(
        "SELECT * FROM users WHERE user_id = ?", userID)
    
    if (userByID.length > 0) {
        const result = userByID[0]
        return Promise.resolve(
            User(
                result.user_id.toString(),
                result.firstname,
                result.lastname,
                result.role,
                result.email,
                result.password,
                result.phone,
                result.address,
                result.authentication_key,
            )
        )
    } else {
        return Promise.reject("no results found")
    }
}

// by Email
export async function getByEmail(email) {
    const [userEmail] = await db.query(
        "SELECT * FROM users WHERE email = ?", email
    )

    if (userEmail.length > 0) {
        const userResult = userEmail[0]
        return Promise.resolve(
            User(
                userResult.user_id.toString(),
                userResult.firstname,
                userResult.lastname,
                userResult.role,
                userResult.email,
                userResult.password,
                userResult.phone,
                userResult.address,
                userResult.authentication_key,
            )
        )
    } else {
        return Promise.reject("no results found")
    }
}

// Authentication
export async function getByAuthenticationKey(authenticationKey) {
    const [authKey] = await db.query(
        "SELECT * FROM users WHERE authentication_key = ?", authenticationKey
    )
        // The db.query method may return an empty array [] if no results are found 
        // for the given authentication key. In that case, authKey.length will be undefined
        // and the if statement will throw an error. Add a null check before checking length
    if (authKey !==null && authKey.length > 0) {
        const userResult = authKey[0]
        return Promise.resolve(
            new User(
                userResult.user_id.toString(),
                userResult.firstname,
                userResult.lastname,
                userResult.role,
                userResult.email,
                userResult.password,
                userResult.phone,
                userResult.address,
                userResult.authentication_key,
            )
        )
    } else {
        return Promise.reject("no results found")
    }
}

// Create
export async function create(user) {
    delete user.user_id

    return db.query(
        "INSERT INTO users (firstname, lastname, role, email, password, phone, address) "
        + "VALUE (?, ?, ?, ?, ?, ?, ?)",
        [
            user.firstname,
            user.lastname,
            user.role,
            user.email,
            user.password,
            user.phone,
            user.address,
        ]
    ).then(([result]) => {
        return { ...user, user_id: result.insertId}
    })
}

// Update
export async function update(user) {
    return db.query(
        "UPDATE users SET "
        + "firstname = ?, "
        + "lastname = ?, "
        + "role = ?, "
        + "email = ?, "
        + "password = ?, "
        + "phone = ?, "
        + "address = ?, "
        + "authentication_key = ? "
        + "WHERE user_id = ?",
        [
            user.firstname,
            user.lastname,
            user.role,
            user.email,
            user.password,
            user.phone,
            user.address,
            user.authentication_key,
            user.user_id
        ]
    ).then(([result]) => {
        return { ...user}
    })
}
// Delete
export async function deleteByID(userID) {
    return db.query("DELETE FROM users WHERE user_id = ?", [userID])
}