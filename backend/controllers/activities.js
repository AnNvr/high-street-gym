import { Router } from "express";
import { Activity, deleteByID } from "../models/activities.js";
import { validate } from "../middleware/validator.js";
import { create, getAll, getByID, update } from "../models/activities.js";
import xml2js from"xml2js";
import auth from "../middleware/auth.js";

const activityController = Router()


const getActivityListSchema = {
    type: "object",
    properties: {}
}

activityController.get(
    "/activities", 
    [
        auth(["manager", "trainer"]),
        validate({body: getActivityListSchema})
    ],
    async (req, res) => {
    const activities = await getAll()
    // console.log(activities)
    res.status(200).json({
        status: 200,
        message: "Activities available here",
        activities: activities
    })
})

const getActivityByIDSchema = {
    type: "object",
    required: ["id"],
    properties: {
        activity_id: {
            type: "string",
        }
    }
}

activityController.get(
    "/activities/:id", validate({params: getActivityByIDSchema}),
(req, res) => {
    const activityID = req.params.id
    getByID(activityID).then(activity => {
        res.status(200).json({
            status: 200,
            message: "Get Activity By ID",
            activity: activity
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to get activity by ID"
        })
    })
})

// XML upload endpoint
activityController.post("/activities/upload/xml", (req, res) => {
    if (req.files && req.files["xml-file"]) {
        // Access the XML file as a string
        const XMLFile = req.files["xml-file"]
        const file_text = XMLFile.data.toString()

        // Set up XML parser
        const parser = new xml2js.Parser()
        parser.parseStringPromise(file_text)
            .then(data => {
                const activityUpload = data["activity-upload"]
                const activityUploadAttributes = activityUpload["$"]
                const operation = activityUploadAttributes["operation"]
                // indexing to reach nested children
                const activitiesData = activityUpload["activities"][0]["activity"]

                if (operation == "insert") {
                    Promise.all(activitiesData.map((activityData) => {
                        // Convert the xml object into a model object
                        const activityModel = Activity(
                            null,
                            activityData.name.toString(),
                            activityData.level.toString(),
                            activityData.duration.toString()
                        )
                        // Return the promise of each creation query
                        return create(activityModel)
                    })).then(results => {
                        res.status(200).json({
                            status: 200,
                            message: "XML Upload successful",
                        })
                    }).catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: "XML Upload failed on database operation - " + error,
                        })
                    })
                } else if (operation == "update") {
                    Promise.all(activitiesData.map((activityData) => {
                        // Convert the xml object into a model object
                        const activityModel = Activity(
                            activityData.activity_id.toString(),
                            activityData.name.toString(),
                            activityData.level.toString(),
                            activityData.duration.toString()
                        )
                        // return the promise of each creation query
                        return update(activityModel)
                    })).then(results => {
                        res.status(200).json({
                            status: 200,
                            message: "XML upload failed on database operation - " + error,
                        })
                    })
                } else {
                    res.status(400).json({
                        status: 400,
                        message: "XML contains invalid operation attribute values",
                    })
                }
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "Error parsing XML - " + error,
                })
            })
    } else {
        res.status(400).json({
            status: 400,
            message: "No file selected",
        })
    }
})

const createActivitySchema = {
    type: "object",
    required: ["name", "level", "duration"],
    properties: {
        name: {
            type: "string"
        },
        level: {
            type: "string"
        },
        duration: {
            type: "string"
        },
    }
}

activityController.post("/activities", validate({body: createActivitySchema}),
    (req, res) => {
    const activityData = req.body
    const activity = Activity(
        null,
        activityData.name,
        activityData.level,
        activityData.duration
        )
    create(activity).then(createdActivity => {
        res.status(200).json({
            status: 200,
            message: "Created activity!",
            activity: createdActivity,
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to create animal"
        })
    })
})

const updateActivitySchema = {
    type: "object",
    required: ["activity_id"],
    properties: {
        activity_id: {
            type: "number",
        },
        name: {
            type: "string"
        },
        level: {
            type: "string"
        },
        duration: {
            type: "string"
        },
    }
}

activityController.patch("/activities", validate({body: updateActivitySchema}),
    (req, res) => {
    const activityData = req.body
    const activity = Activity(
        activityData.activity_id,
        activityData.name,
        activityData.level,
        activityData.duration
    )
    update(activity)
        .then(updatedActivity => {
            res.status(200).json({
                status: 200,
                message: "Updated activity!",
                activity: updatedActivity
            })
        })
})

const deleteActivitySchema = {
    type: "object",
    required: ["activity_id"],
    properties: {
        activity_id: {
            type: "number"
        }
    }
}

activityController.delete("/activities", validate({body: deleteActivitySchema}),
    (req, res) => {
    const activityID = req.body.activity_id

    deleteByID(activityID)
        .then(result => {
            res.status(200).json({
                status: 200,
                message: "Deleted activity!",
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed!Check the controller"
        })
    })
})

export default activityController