import React, { useState, useEffect } from "react";
import SinglePost from "./SinglePost";

const GetGroupPosts = ({ groupId, postAmount }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-group-posts?groupId=${groupId}`
                );
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
    }, [postAmount]);

    if (!Array.isArray(posts)) {
        return <div>Still nothing here</div>;
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
                        currentUserId={1}     //?????
                        profilePic={post.profilePic}
                        showComments={false}
                    />
                ))
            ) : (
                <div> Still nothing here</div>
            )}
        </div>
    );
};

export default GetGroupPosts;
