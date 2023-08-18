import React, { useState, useEffect } from "react";
import SinglePost from "./SinglePost";

const GetUserPosts = ({ userId, currentUserId }) => {
    const [posts, setUserPosts] = useState([]);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-user-posts?userId=${userId}&currentUserId=${currentUserId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setUserPosts(data);
                } else {
                    console.error("Failed to fetch posts:", response.status);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, [userId]);

    if (!Array.isArray(posts)) {
        return <div>Loading posts...</div>;
    }

    return (
        <div>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <SinglePost
                        key={post.postId}
                        postId={post.postId}
                        userId={post.userId}
                        displayName={post.displayName}
                        privacy={post.privacy}
                        img={post.img}
                        createdAt={post.createdAt}
                        content={post.content}
                        comments={post.commentAmount}
                        currentUserId={currentUserId}
                        profilePic={post.profilePic}
                    />
                ))
            ) : (
                <div>Loading posts...</div>
            )}
        </div>
    );
};

export default GetUserPosts;
