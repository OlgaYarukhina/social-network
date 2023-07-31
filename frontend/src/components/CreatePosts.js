import React, { useState, useEffect } from "react";

const CreatePost = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/posts");
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                } else {
                    console.error("Failed to fetch posts:", response.status);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            <form className="needs-validation" method="POST">
                <div className="mb-3">
                    <textarea className="form-control" id="content" name="content" placeholder="Add content" rows="6" required></textarea>
                </div>
                <div className="mb-3">
                    <button className="btn btn-dark" type="submit">Save</button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;




{/* 

 */}