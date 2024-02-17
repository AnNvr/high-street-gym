import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAllBlog } from "../api/blog";
import { useState, useEffect } from "react";
import { useAuthentication } from "../hooks/authentication.jsx";
import DashNav from "../components/DashNav";

export default function Blog() {
    const [user] = useAuthentication();
    const [blog, setBlog] = useState([]);

    useEffect(() => {
        if (user.user_id && user.authentication_key) {
            getAllBlog(user.authentication_key)
                .then(blog => {
                    setBlog(blog);
                });
        }
    }, [user.user_id, user.authentication_key]);

    const renderNavigation = () => {
        if (user) {
            return <DashNav />;
        } else {
            return <Navbar />;
        }
    };

    return (
        <>
            {renderNavigation()}
            <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4 font-poppins">
                {blog.map((blogItem) => (
                    <div key={blogItem.blog_id} className="flex flex-col lg:flex-row justify-between gap-8">
                        <div className="w-full lg:w-5/12 flex flex-col justify-center">
                            <label className="font-normal text-base">{new Date(blogItem.date).toLocaleDateString()}</label>
                            <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">{blogItem.title}</h1>
                            <p className="font-normal text-base leading-6 text-gray-600 ">{blogItem.content}</p>
                        </div>
                        <div className="w-full lg:w-8/12 m-6">
                            <img className="w-full h-full shadow-xl rounded-lg" src={`https://source.unsplash.com/1600x900/?portrait=${Math.random()}`} alt="gym" />
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
}
