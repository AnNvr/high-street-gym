import { Router } from "express";
import { validate } from "../middleware/validator.js";
import { Blog, create, update, getAll, getByID, deleteByID, blogInnerJoin } from "../models/blog.js";
import auth from "../middleware/auth.js";

const blogController = Router()

const getBlogListSchema = {
    type: "object",
    properties: {}
}

blogController.get(
    "/blog",
    [
        auth(["manager", "trainer", "member"]),
        validate({body: getBlogListSchema})
    ],
    async (req, res) => {
        const blog = await getAll()

        res.status(200).json({
            status: 200,
            message: "blog list available here",
            blog: blog
    })
})

const getInnerJoinListSchema = {
    type: "object",
    properties: {}
}

blogController.get(
    "/blog-list",
    [
        auth(["manager", "trainer", "member"]),
        validate({body: getInnerJoinListSchema})
    ],
    async (req, res) => {
        const innerJoin = await blogInnerJoin()

        res.status(200).json({
            status: 200,
            message: "list returned",
            blog: innerJoin
        })
    }
)

const getBlogByIDSchema = {
    type: "object",
    properties: {
        id: {
            type: "string",
        }
    }
}

blogController.get(
    "/blog/:id", validate({params: getBlogByIDSchema}),
    (req, res) => {
        const blogID = req.params.id
        getByID(blogID).then(blog => {
            res.status(200).json({
                status: 200,
                message: "Get Blog Post by ID",
                blog: blog
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get blog by ID",
                error: error
            })
        })
    }
)

const createBlogSchema = {
    type: "object",
    required: ["title", "date", "content"],
    properties: {
        title: {
            type: "string",
        },
        date: {
            type: "string",
        },
        content: {
            type: "string",
        },
    }
}

blogController.post(
    "/blog/",
    [
        auth(["manager", "trainer"]),
        validate({ body: createBlogSchema })],
    (req, res) => {

        const blogData = req.body
        
        const blog = Blog(
            null,
            blogData.title,
            blogData.date,
            blogData.content,
            blogData.user_id
        )
        
        create(blog).then(createdBlog => {
            res.status(200).json({
                status: 200,
                message: "Created blog",
                blog: createdBlog,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to create blog" + error
            })
        })
    })

const updateBlogSchema = {
    type: "object",
    required: ["blog_id"],
    properties: {
        blog_id: {
            type: "number",
        },
        title: {
            type: "string",
        },
        date: {
            type: "string",
        },
        content: {
            type: "string",
        },
        user_id: {
            type: "number",
        },
    }
}

blogController.patch(
    "/blog",
    [
        auth(["manager",  "trainer"]),
        validate({ body: updateBlogSchema })
    ],
    (req, res) => {
        const blogData = req.body
        const blog = Blog(
            blogData.blog_id,
            blogData.title,
            blogData.date,
            blogData.content,
            blogData.user_id
        )
        update(blog)
            .then(updatedBlog => {
                res.status(200).json({
                    status: 200,
                    message: "Updated blog",
                    blog: updatedBlog,
                })
            })
    }
)

const deleteBlogSchema = {
    type: "object",
    properties: {
        blog_id: {
            type: "number",
        }
    }
}

blogController.delete(
    "/blog",
    [
        auth(["manager", "trainer"]),
        validate({ body: deleteBlogSchema })
    ],
    (req, res) => {
    const blogID = req.body.blog_id

    deleteByID(blogID)
        .then(result => {
            res.status(200).json({
                status: 200,
                message: "Deleted blog",
                result: result
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed!Check the controller" + error
            })
        })
})

export default blogController