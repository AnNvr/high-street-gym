import { db } from "../database.js"

// Model for Activities
export function Activity(activity_id, name, level, duration) {
    return {
        activity_id,
        name,
        level,
        duration,
    }
}

export async function getAll() {
    // Get the collection of all activities
    const [allActivitiesResults] = await db.query("SELECT * FROM activities")
    
    // Convert these results into a list of activities objects
    return allActivitiesResults.map((activityResult) => {
        return Activity(
            activityResult.activity_id,
            activityResult.name,
            activityResult.level,
            activityResult.duration
        )}
    )
}

export async function getByID(activityID) {
    // Get the item by ID
    const [activitiesResults] = await db.query(
        "SELECT * FROM activities WHERE activity_id = ?", activityID
    )
    // Check we found a result and convert into an object
    if (activitiesResults.length > 0) {
        const activityResult = activitiesResults[0]
        return Promise.resolve(
            Activity(
                activityResult.activity_id,
                activityResult.name,
                activityResult.level,
                activityResult.duration
            )
        )
    } else {
        return Promise.reject("No result found")
    }
}

export async function create(activity) {
    // New bodies should not have existing IDs, delete just to be sure
    delete activity.activity_id
    // Insert activity object and return resulting promise
    return db.query(
        "INSERT INTO activities (name, level, duration) VALUES (?, ?, ?)",
        [activity.name, activity.level, activity.duration]
    ).then(([result]) => {
        // Inject the inserted ID into the activity object and return
        return {...activity, activity_id: result.insertId }
    })
}

export async function update(activity) {
    return db.query(
        "UPDATE activities SET name = ?, level = ?, duration = ? WHERE activity_id = ?",
        [activity.name, activity.level, activity.duration, activity.activity_id]
    )
}

export async function deleteByID(activityID) {
    return db.query("DELETE FROM activities WHERE activity_id = ?", [activityID])
}