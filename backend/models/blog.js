import { db } from "../database.js"

// Model for Blog
export function Blog(blog_id, title, date, content, user_id) {
    return {
        blog_id,
        title,
        date,
        content,
        user_id,
    }
}

function innerJoinList(blog_id, title, date, content, firstname, lastname) {
    return {
        blog_id,
        title,
        date,
        content,
        firstname,
        lastname,
    }
}

// INNER JOIN
export async function blogInnerJoin() {
    const [allInnerJoin] = await db.query(`SELECT
    blog.blog_id,
    blog.title,
    blog.date,
    blog.content,
    users.firstname,
    users.lastname
    FROM
    blog
    INNER JOIN users ON blog.user_id = users.user_id
    `)

    return allInnerJoin.map((result) => {
        return innerJoinList(
            result.blog_id,
            result.title,
            result.date,
            result.content,
            result.firstname,
            result.lastname,
        )
    })
}

export async function getAll() {
    
    const [allBlogPostsResults] = await db.query("SELECT * FROM blog")

    return allBlogPostsResults.map((result) => {
        return Blog(
            result.blog_id,
            result.title,
            result.date,
            result.content,
            result.user_id
        )
    })
}

export async function getByID(blogID) {

    const [blogPostsResult] = await db.query(
        "SELECT * FROM blog WHERE blog_id = ?", blogID
    )

    if (blogPostsResult.length > 0) {
        const blogResult = blogPostsResult[0]
        return Promise.resolve(
            Blog(
                blogResult.blog_id,
                blogResult.title,
                blogResult.date,
                blogResult.content,
                blogResult.user_id,
            )
        )
    } else {
        return Promise.reject("No result found")
    }
}

export async function create(blog) {

    delete blog.blog_id
    
    return db.query(
        "INSERT INTO blog (title, date, content, user_id) VALUES (?, ?, ?, ?)",
        [blog.title, blog.date, blog.content, blog.user_id]
    ).then(([result]) => {
        return {...blog, blog_id: result.insertId}
    })
}

export async function update(blog) {
    return db.query(
        "UPDATE blog SET title = ?, date = ?, content = ?, user_id = ? WHERE blog_id = ?",
        [blog.title, blog.date, blog.content, blog.user_id, blog.blog_id]
    )
}

export async function deleteByID(blogID) {
    return db.query("DELETE FROM blog WHERE blog_id = ?", [blogID])
}