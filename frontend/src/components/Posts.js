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

    return (
        <div>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.postId}>
                        <div className="col">
                            <div className="card shadow-sm posts">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="col-2 d-flex" >
                                            <img
                                                src={"https://cdn-icons-png.flaticon.com/512/6065/6065522.png"}
                                                width="60"
                                                height="60"
                                            />
                                        </div>
                                        <div className="col d-flex align-items-center" >
                                            <p className="card-text">{post.nickname}</p>
                                        </div>
                                        <small className="text-body-secondary">{post.privacy}</small>
                                    </div>
                                </div>
                                <img
                                    src={`http://localhost:8080/get-image/${post.img}`}
                                />
                                <div className="card-body">
                                    <p className="card-text posts_content_cut">{post.content}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-sm">Like</button>  {post.likes}
                                            <button type="button" className="btn btn-sm">Coment</button>  ?
                                        </div>
                                        <small className="text-body-secondary">{post.createdAt.slice(0, 10)}</small>
                                    </div>
                                </div>
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



// if (!Array.isArray(posts)) {              
//     return <div><h1>Loading posts...</h1></div>;
// }