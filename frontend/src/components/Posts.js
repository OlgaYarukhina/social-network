import React, { useState, useEffect } from "react";

const GetPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                console.log("Try get posts")
                const response = await fetch("http://localhost:8080/posts");
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
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


    if (!Array.isArray(posts)) {              // it needs to avoid mistakes with posts.map while db does not connected
        return <div><h1>Loading posts...</h1></div>;
    }

    return (
        <div>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.postId}>
                        <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                            <div className="col p-4 d-flex flex-column position-static">
                                <div className="mb-2 text-body-secondary">{post.createdAt}</div>
                                <p className="mb-2 text-in-box">
                                    {post.content}
                                </p>
                                <div className="text-body-secondary"> Likes: XXX </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div>Loading posts...</div>
            )}
        </div>
    );
};

export default GetPosts;
