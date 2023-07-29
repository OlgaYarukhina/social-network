import React, { useState, useEffect } from "react";

const GetPosts = () => {
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


    if (!Array.isArray(posts)) {              // it needs to avoid mistakes with posts.map while db does not connected
        return <div><h1>Loading posts...</h1></div>;
      }

    return (
        <div>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.postId}>
                        <h3>{post.title}</h3>
                    </div>
                ))
            ) : (
                <div>Loading posts...</div>
            )}
            <div className="col-8">
                <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                    <div className="col p-4 d-flex flex-column position-static">
                        <h3 className="mb-0">EXAMPLE</h3>
                        <div className="mb-2 text-body-secondary">Created at</div>
                        <p className="mb-2 text-in-box">
                            Components often need to change what’s on the screen as a result of an interaction.
                            Typing into the form should update the input field, clicking “next” on an image carousel
                            should change which image is displayed, clicking “buy” should put a product in the shopping cart.
                            Components need to “remember” things: the current input value, the current image, the shopping cart.
                            In React, this kind of component-specific memory is called state.
                        </p>
                        <a href="/post?id={{.ID}}" className="stretched-link text-secondary">Continue reading</a>
                        <div className="text-body-secondary"> Likes: XXX </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetPosts;



{/* 
 */}