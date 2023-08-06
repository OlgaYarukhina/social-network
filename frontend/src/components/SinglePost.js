import { useEffect, useState } from "react";
import CreateComment from "./Comment";
import { getTimeDiff } from "./Posts";
import Popup from "./Popup";
import { useNavigate } from "react-router-dom";

function SinglePost({
    postId,
    userId,
    displayName,
    privacy,
    img,
    createdAt,
    content,
    currentUserId,
    profilePic,
}) {
    const [likes, setLikes] = useState([]);
    const [currentUserLike, setCurrentUserLike] = useState(null);
    const [likeAmount, setLikeAmount] = useState(null);
    const [showLikesPopup, setShowLikesPopup] = useState(false);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handlePostClick = () => {
        setExpanded(!expanded);
    };

    const navigateTo = useNavigate();
    useEffect(() => {
        const getLikes = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-likes?userId=${currentUserId}&postId=${postId}`
                );
                if (response.ok) {
                    const data = await response.json();

                    var hasLiked = false;
                    data.forEach((like) => {
                        if (like.userId === currentUserId) {
                            hasLiked = true;
                        }
                    });

                    console.log(data);
                    setLikeAmount(data.length);
                    setCurrentUserLike(hasLiked);
                    setLikes(data);
                } else {
                    console.log(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        };

        getLikes();
    }, [currentUserLike]);

    const handlePostLike = async (postId) => {
        setCurrentUserLike(!currentUserLike);

        const payload = {
            postId,
            userId: currentUserId,
        };
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        };

        try {
            const response = await fetch(
                "http://localhost:8080/post-like",
                options
            );
            if (response.ok) {
                console.log("ok");
            } else {
                console.log(":(");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCommentClick = async () => {
        setShowComments(!showComments);
    
        if (!showComments) {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-comments?postId=${postId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setComments(data);
                } else {
                    console.log(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };
    

    if (currentUserLike !== null) {
        return (
            <div>
                <div className="col">
                    <div className="card shadow-sm post">
                        <div className="card">
                            <div
                                onClick={() => navigateTo(`/user/${userId}`)}
                                style={{ cursor: "pointer" }}
                                className="d-flex align-items-center"
                            >
                                <div className="col-2 d-flex">
                                    <img
                                        src={`http://localhost:8080/get-image/users/${profilePic}`}
                                        width="60"
                                        height="60"
                                    />
                                </div>
                                <div className="col d-flex align-items-center">
                                    <p className="card-text">{displayName}</p>
                                </div>
                                <div className="col-2">
                                    <small className="text-body-secondary">
                                        {privacy}
                                    </small>
                                </div>
                            </div>
                        </div>
                        {img && (
                            <img
                                src={`http://localhost:8080/get-image/posts/${img}`}
                            />
                        )}
                        <div className="card-body">
                            <p
                                className={`card-text ${expanded ? "" : "posts-content-cut"} clickable-text`}
                                onClick={handlePostClick}
                            >
                                {content}
                            </p>
                            {(!expanded && content.length > 100) && (
                                <p
                                    className="expand-post-link expand-link-text clickable-text"
                                    onClick={handlePostClick}
                                >
                                    Show more
                                </p>
                            )}
                            {expanded && (
                                <p
                                    className="expand-post-link expand-link-text clickable-text"
                                    onClick={handlePostClick}
                                >
                                    Show less
                                </p>
                            )}
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="btn-group">
                                    <div
                                        style={{
                                            backgroundImage: `url(http://localhost:3000/icons/Like${currentUserLike ? "" : "1"}_72px.png)`,
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center center",
                                            width: "22px",
                                            height: "22px",
                                            marginRight: "8px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() =>
                                            handlePostLike(parseInt(postId))
                                        }
                                    >
                                    </div>{" "}
                                    <small
                                        style={{
                                            cursor:
                                                likes.length > 0
                                                    ? "pointer"
                                                    : "default",
                                        }}
                                        className="text-body-secondary"
                                        onClick={() =>
                                            setShowLikesPopup(
                                                likes.length ? true : false
                                            )
                                        }
                                    >
                                        {likeAmount}
                                    </small>
                                    <Popup
                                        title="Liked by"
                                        users={likes}
                                        show={showLikesPopup}
                                        currentUserId={currentUserId}
                                        onClose={() => setShowLikesPopup(false)}
                                    />
                                    <div
                                        className="comment-button"
                                        onClick={handleCommentClick}
                                    >
                                    </div>
                                </div>
                                <small className="text-body-secondary">
                                    {getTimeDiff(createdAt)}
                                </small>
                            </div>
                        </div>
                        {showComments && comments.map((comment) => (
                        <div className="comments-field">
                            <p>{comment.text}</p> 
                        </div>
                    ))}
                        <CreateComment userId={currentUserId} />
                    </div>
                  
                </div>
            </div>
        );
    }
}

export default SinglePost;
