import express from'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'

//Create express application
const app = express()
const port = 8080

// Enable cross-origin resources sharing (CORS)
app.use(cors({
    // Allow all origins
    origin: true}))

app.use(express.json())

// Enable file upload support
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}))

// Import and use the routers of each controller
import activityController from './controllers/activities.js'
app.use(activityController)
import userController from './controllers/user.js'
app.use(userController)
import blogController from './controllers/blog.js'
app.use(blogController)
import bookingController from './controllers/trainer-bookings.js'
app.use(bookingController)
import bookingsController from './controllers/gym-bookings.js'
app.use(bookingsController)

import { validateErrorMiddleware } from './middleware/validator.js'
app.use(validateErrorMiddleware)

app.listen(port, () => {
    console.log(`Express server started on http://localhost:${port}`)
})