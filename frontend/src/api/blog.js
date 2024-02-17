import { API_URL } from "./api.js";

export async function getAllBlog(authenticationKey) {
    const response = await fetch(API_URL + "/blog?authKey=" + authenticationKey);

    const getBlogResponse = await response.json();

    return getBlogResponse.blog
}

export async function getInnerJoinList(authenticationKey) {
    
    const response = await fetch(
        API_URL + "/blog-list?authKey=" + authenticationKey,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.blog
}

export async function getBlogByID(blogID) {
    const response = await fetch(
        API_URL + "/blog/" + blogID,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
    )

    const getBlogByIdResponse = await response.json()

    return getBlogByIdResponse.blog
}


export async function createBlog(blog, authenticationKey) {
    const response = await fetch(
        API_URL + "/blog?authKey=" + authenticationKey,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...blog, authenticationKey}),
        });

    const createBlogResponse = await response.json();

    return createBlogResponse.blog
}

export async function updateBlog(blog, authenticationKey) {
    const response = await fetch(API_URL + "/blog", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({...blog, authenticationKey}),
    });

    const updateBlogResponse = await response.json();

    return updateBlogResponse
}

export async function deleteBlogByID(blog, authenticationKey) {
    const response = await fetch(API_URL + "/blog", 
    {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({...blog, authenticationKey}),
    });

    const deleteBlogResponse = await response.json();

    return deleteBlogResponse
}
