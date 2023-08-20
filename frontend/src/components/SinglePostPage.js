import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import SinglePost from "./SinglePost";
import GetComments from "./GetComments";

function SinglePostPage({}) {
    let { postId } = useParams();
    const [post, setPost] = useState(null);
    const sessionData = useOutletContext();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-single-post?postId=${postId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setPost(data);
                } else {
                    console.error("Failed to fetch posts:", response.status);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPost();
    }, []);

    if (post) {
        return (
            <>
                <SinglePost
                    postId={postId}
                    userId={post.userId}
                    displayName={post.displayName}
                    privacy={post.privacy}
                    img={post.img}
                    createdAt={post.createdAt}
                    content={post.content}
                    comments={post.commentAmount}
                    currentUserId={sessionData.userData.userId}
                    profilePic={post.profilePic}
                    showComments={true}
                />
            </>
        );
    }
}

export default SinglePostPage;
