import { Validator, ValidationError } from "express-json-validator-middleware";

// Create validator object to configure the validator in a variable
const validator = new Validator()

//Export validate middleware for use in endpoints
export const validate = validator.validate

// Export error handling middleware
export const validateErrorMiddleware = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }

    const isValidationError = error instanceof ValidationError
    if (!isValidationError) {
        return next(error)
    }

    res.status(400).json({
        status: 400,
        message: "Validation Error Ongoing",
        errors: error.validationErrors,
    })

    next()
}