import React, { useState, useEffect } from "react";
import AddComment from "./Comment";

const GetPosts = () => {
    const [posts, setPosts] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(-1); // Initialize to -1 to indicate no post is expanded

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:8080/posts");
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
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

    const handlePostClick = (index) => {
        // Toggle the expansion state for the clicked post
        setExpandedIndex((prevIndex) => (prevIndex === index ? -1 : index));
    };

    if (!Array.isArray(posts)) {
        return <div>Loading posts...</div>;
    }

    return (
        <div>
            {posts.length > 0 ? (
                posts.map((post, index) => (
                    <div key={post.postId}>
                        <div className="col">
                            <div className="card shadow-sm post">
                                <div className="card">
                                    <div className="d-flex align-items-center">
                                        <div className="col-2 d-flex">
                                            <img
                                                src={
                                                    "https://cdn-icons-png.flaticon.com/512/6065/6065522.png"
                                                }
                                                width="60"
                                                height="60"
                                            />
                                        </div>
                                        <div className="col d-flex align-items-center">
                                            <p className="card-text">{post.nickname}</p>
                                        </div>
                                        <div className="col-2">
                                            <small className="text-body-secondary">
                                                {post.privacy}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                {post.img && (
                                    <img
                                        src={`http://localhost:8080/get-image/posts/${post.img}`}
                                    />
                                )}
                                <div className="card-body">
                                    <p
                                        className={`card-text ${expandedIndex === index ? "" : "posts-content-cut"
                                            } clickable-text`}
                                        onClick={() => handlePostClick(index)}
                                    >
                                        {post.content}
                                    </p>
                                    {expandedIndex !== index && post.content.length > 100 && (
                                        <p
                                            className="expand-post-link expand-link-text clickable-text"
                                            onClick={() => handlePostClick(index)}
                                        >
                                            Show more
                                        </p>
                                    )}
                                    {expandedIndex === index && (
                                        <p
                                            className="expand-post-link expand-link-text clickable-text"
                                            onClick={() => handlePostClick(index)}
                                        >
                                            Show less
                                        </p>
                                    )}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-sm">
                                                Like
                                            </button>{" "}
                                            <small className="text-body-secondary">
                                                {post.likes}
                                            </small>
                                            <button type="button" className="btn btn-sm">
                                                Comments
                                            </button>{" "}
                                            <small className="text-body-secondary">?</small>
                                        </div>
                                        <small className="text-body-secondary">
                                            {post.createdAt.slice(0, 10)}
                                        </small>
                                    </div>
                                </div>
                                <AddComment />
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
