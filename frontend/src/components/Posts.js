import React, { useState, useEffect } from "react";
import SinglePost from "./SinglePost";

const GetPosts = ({ userId }) => {
    const [posts, setPosts] = useState([]);

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
                        currentUserId={userId}
                        profilePic={post.profilePic}
                    />
                ))
            ) : (
                <div>Loading posts...</div>
            )}
        </div>
    );
};

export const getTimeDiff = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();

    const timeDiffInMilliseconds = now - date;
    const timeDiffInSeconds = timeDiffInMilliseconds / 1000;

    if (timeDiffInSeconds < 60) {
        return "just now";
    } else if (timeDiffInSeconds < 60 * 60) {
        const minutesAgo = Math.floor(timeDiffInSeconds / 60);
        return `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
    } else if (timeDiffInSeconds < 24 * 60 * 60) {
        const hoursAgo = Math.floor(timeDiffInSeconds / (60 * 60));
        return `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
    } else if (timeDiffInSeconds < 7 * 24 * 60 * 60) {
        const daysAgo = Math.floor(timeDiffInSeconds / (24 * 60 * 60));
        return `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;
    } else if (timeDiffInSeconds < 30 * 24 * 60 * 60) {
        const weeksAgo = Math.floor(timeDiffInSeconds / (7 * 24 * 60 * 60));
        return `${weeksAgo} week${weeksAgo !== 1 ? "s" : ""} ago`;
    } else if (timeDiffInSeconds < 12 * 30 * 24 * 60 * 60) {
        const monthsAgo = Math.floor(timeDiffInSeconds / (30 * 24 * 60 * 60));
        return `${monthsAgo} month${monthsAgo !== 1 ? "s" : ""} ago`;
    } else {
        const yearsAgo = Math.floor(timeDiffInSeconds / (365 * 24 * 60 * 60));
        return `${yearsAgo} year${yearsAgo !== 1 ? "s" : ""} ago`;
    }
};

export default GetPosts;
