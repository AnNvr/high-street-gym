import { getByAuthenticationKey } from "../models/user.js"

export default function auth(allowed_roles) {
    return function (req, res, next) {
        const authenticationKey = req.body.authenticationKey ?? req.query.authKey

        if (authenticationKey) {
            getByAuthenticationKey(authenticationKey)
                .then(user => {
                    if (allowed_roles.includes(user.role)) {
                        req.user = user // passing the user object in the req helps me to list only whatever is related to that user
                        next()
                    } else {
                        res.status(403).json({
                            status: 403,
                            message: "Access forbidden",
                        })
                    }
                })
                .catch(error => {
                    res.status(401).json({
                        status: 401,
                        message: "Authentication key invalid",
                    })
                })
        } else {
            res.status(401).json({
                status: 401,
                message: "Authentication key missing",
            })
        }
    }
}
