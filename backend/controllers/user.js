import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid4 } from "uuid";
import { validate } from "../middleware/validator.js";
import { User, getAll, getByID, getByAuthenticationKey, getByEmail, update, create, deleteByID } from "../models/user.js";
import auth from "../middleware/auth.js";

const userController = Router()

// Login
const loginSchema = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: {
            type: "string"
        },
        password: {
            type: "string"
        }
    }
}

userController.post("/users/login",
    validate({ body: loginSchema }),
    (req, res) => {

    let loginData = req.body

    getByEmail(loginData.email)
        .then(user => {
            if (bcrypt.compareSync(loginData.password, user.password)) {
                user.authentication_key = uuid4().toString()

                update(user).then(result => {
                    res.status(200).json({
                        status: 200,
                        message: "User logged in!",
                        userID: user.user_id,
                        authenticationKey: user.authentication_key,
                    })
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: "Invalid Credentials"
                })
            }
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Login failed"
            })
        })
    }
)

// Logout
const logoutSchema = {
    type: "object",
    required: ["authenticationKey"],
    properties: {
        authenticationKey: {
            type: "string"
        }
    }
}

userController.post("/users/logout",
    validate({ body: logoutSchema }),
    (req, res) => {

    const authenticationKey =req.body.authenticationKey

    getByAuthenticationKey(authenticationKey)
        .then(user => {
            user.authenticationKey = null
            update(user).then(user => {
                res.status(200).json({
                    status: 200,
                    message: "User logged out"
                })
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to logout user" + error
            })
        })
    }
)

// GET All
const userListSchema = {
    type: "object",
    properties: {}
}

userController.get(
    "/users",
    [
        auth(["manager"]),
        validate({ body: userListSchema })
    ],
    async (req, res) => {

        const users = await getAll()

        res.status(200).json({
            status: 200,
            message: "User list",
            users: users,
        })
    }
)

// Get by ID
const getByIDSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
        }
    }
}

userController.get(
    "/users/:id", 
    [
        auth(["manager", "trainer", "member"]),
        validate({ params: getByIDSchema })
    ],
    (req, res) => {
        const userID = req.params.id
        // const authenticatedUser = req.user
        // If the authenticated user is a trainer or member, 
        // the statement checks if they're requesting their own user information
        getByID(userID).then(user => {
            console.log(req.params.id)

            if (userID.role === "trainer" || userID.role === "member") {
                if (userID.id !== userID) {
                    return res.status(403).json({
                        status: 403,
                        message: "You are not authorized to view this user's information."
                    })
                }
            }
            res.status(200).json({
                status: 200,
                message: "Get user by ID",
                user: user,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get user by ID" + error
            })
        })
    }
)

// Get by authentication key
const getUserByAuthenticationKeySchema = {
    type: "object",
    required: ["authenticationKey"],
    properties: {
        authenticationKey: {
            type: "string",
        }
    }
}

userController.get(
    "/users/by-key/:authenticationKey",
    validate({ params: getUserByAuthenticationKeySchema }),
    (req, res) => {
        const authenticationKey = req.params.authenticationKey

        getByAuthenticationKey(authenticationKey).then(user => {
            res.status(200).json({
                status: 200,
                message: "Get user by authentication key",
                user: user,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get user by auth key: " + error
            })
        })
    }
)


// Create User
const createUserSchema = {
    type: "object",
    required: [],
    properties: {
        user: {
            type: "object",
            required: [
                "firstname",
                "lastname",
                "role",
                "email",
                "password",
                "phone",
                "address",
            ],
            properties: {
                firstname: {
                    type: "string"
                },
                lastname: {
                    type: "string"
                },
                role: {
                    type: "string"
                },
                email: {
                    type: "string"
                },
                password: {
                    type: "string"
                },
                phone: {
                    type: "string"
                },
                address: {
                    type: "string"
                },
            }
        }
    }
}

userController.post("/users",
    [
        auth(["manager"]),
        validate({ body: createUserSchema })
    ], (req, res) => {

        const userData = req.body.user

        // hash the password if it isn't already hashed and is defined
        if (userData.password && !userData.password.startsWith("$2a")) {
            userData.password = bcrypt.hashSync(userData.password);
        } else if (!userData.password) {
            delete userData.password; // remove the password field from the user data object
        }

        const user = User(
            null,
            userData.firstname,
            userData.lastname,
            userData.role,
            userData.email,
            userData.password,
            userData.phone,
            userData.address,
            null
        )

        create(user).then(createdUser => {
            res.status(200).json({
                status: 200,
                message: "Created user",
                user: createdUser
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to create user" + error
            })
        })
    }
)

// Register User
const registerUserSchema = {
    type: "object",
    required: [
        "firstname",
        "lastname",
        "role",
        "email",
        "password",
        "phone",
        "address",
    ],
    properties: {
        firstname: {
            type: "string"
        },
        lastname: {
            type: "string"
        },
        role: {
            type: "string"
        },
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
        phone: {
            type: "string"
        },
        address: {
            type: "string"
        },
    }
}

userController.post(
    "/users/register",
    validate({ body: registerUserSchema }),
    (req, res) => {
        const userData = req.body

        userData.password = bcrypt.hashSync(userData.password)

        const newUser = User(
            null,
            userData.firstname,
            userData.lastname,
            "member",
            userData.email,
            userData.password,
            userData.phone,
            userData.address,
            null
        )

        create(newUser).then(user => {
            res.status(200).json({
                status: 200,
                message: "Registration successful",
                user: user
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Registration failed" + error
            })
        })
    }
)

// Update
userController.patch(
    "/users",
    [
        auth(["manager", "trainer", "member"])
    ],
    async (req, res) => {
        // Get the user data out of the request
        // Retrieve the user_id of the currently logged-in user from the authentication token.
        // const currentUserID = userData.formData.user_id;
        const formData = req.body.formData

        // // Check if the user has a member role and whether they are updating their own data.
        console.log(req.user.role)
        console.log(req.user.user_id)
        console.log(formData.user_id)
        if (req.user.role === "member" && req.user.user_id != formData.user_id) {
            return res.status(403).json({
                status: 403,
                message: "You are not authorized to update other user's data"
            });
        }
        
        // hash the password if it isn't already hashed
        // if (userData.password && !userData.password.startsWith("$2a")) {
        //     userData.password = bcrypt.hash(userData.password)
        // }

        // Convert the user data into a User model object
        const user = User(
            formData.user_id,
            formData.firstname,
            formData.lastname,
            formData.role,
            formData.email,
            formData.password,
            formData.phone,
            formData.address,
            formData.authentication_key
        )

         // Use the update model function to update this user in the DB
        update(user)
            .then(updatedUser => {
                console.log(updatedUser)
            if (updatedUser) {
                res.status(200).json({
                    status: 200,
                    message: "User updated successfully!",
                    user: updatedUser
                })
            } else {
                res.status(404).json({
                    status: 404,
                    message: `User not found`,
            })
        }}).catch(error => {
            console.log(error)
            res.status(500).json({
                status: 500,
                message: "Failed to update user" + error
            })
        })
    }
)

// Delete
const deleteUserSchema = {
    type: "object",
    properties: {
        id: {
            type: "string",
        }
    }
}

userController.delete(
    "/users/:id", 
    [
        auth(["manager"]),
        validate({ params: deleteUserSchema }),
    ],
    (req, res) => {
        const userID = req.params.id

        deleteByID(userID)
        .then((result) => {
            res.status(200).json({
                status: 200,
                message: "User deleted",
                result: result
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to delete user: " + error
            })
        })
    }
)

export default userController