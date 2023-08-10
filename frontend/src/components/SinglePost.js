import { useEffect, useState } from "react";
import CreateComment from "./Comment";
import Popup from "./Popup";
import { useNavigate } from "react-router-dom";
import GetComments from "./GetComments";

function SinglePost({
    postId,
    userId,
    displayName,
    privacy,
    img,
    createdAt,
    content,
    comments,
    currentUserId,
    profilePic,
}) {
    const [likes, setLikes] = useState([]);
    const [currentUserLike, setCurrentUserLike] = useState(null);
    const [likeAmount, setLikeAmount] = useState(null);
    const [showLikesPopup, setShowLikesPopup] = useState(false);
    const [commentAmount, setCommentAmount] = useState(comments);
    const [showComments, setShowComments] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handlePostClick = () => {
        setExpanded(!expanded);
    };

    const updateCommentAmount = () => {
        setCommentAmount((prevAmount) => prevAmount + 1);
    };

    const navigateTo = useNavigate();
    useEffect(() => {
        const getLikes = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-post-likes?userId=${currentUserId}&postId=${postId}`
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

    const handlePostLike = async () => {
        setCurrentUserLike(!currentUserLike);

        const payload = {
            postId: parseInt(postId),
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

    if (currentUserLike !== null) {
        return (
            <div>
                <div className="col">
                    <div className="card shadow-sm post">
                        <div className="card">
                            <div className="d-flex align-items-center">
                                <div className="col-2 d-flex">
                                    <img
                                        src={`http://localhost:8080/get-image/users/${profilePic}`}
                                        width="60"
                                        height="60"
                                        onClick={() =>
                                            navigateTo(`/user/${userId}`)
                                        }
                                        style={{
                                            cursor: "pointer",
                                            borderRadius: "100%",
                                        }}
                                    />
                                </div>
                                <div className="col d-flex align-items-center">
                                    <p
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            navigateTo(`/user/${userId}`)
                                        }
                                        className="card-text"
                                    >
                                        {displayName}
                                    </p>
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
                                className={`card-text ${
                                    expanded ? "" : "posts-content-cut"
                                } clickable-text`}
                                onClick={handlePostClick}
                            >
                                {content}
                            </p>
                            {!expanded && content.length > 100 && (
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
                                            backgroundImage: `url(http://localhost:3000/icons/Like${
                                                currentUserLike ? "" : "1"
                                            }_72px.png)`,
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center center",
                                            width: "22px",
                                            height: "22px",
                                            marginRight: "8px",
                                            cursor: "pointer",
                                        }}
                                        onClick={handlePostLike}
                                    ></div>{" "}
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
                                        style={{
                                            cursor: commentAmount
                                                ? "pointer"
                                                : "default",
                                        }}
                                        onClick={() =>
                                            setShowComments(
                                                commentAmount
                                                    ? !showComments
                                                    : false
                                            )
                                        }
                                    ></div>
                                    <small>{commentAmount}</small>
                                </div>
                                <small className="text-body-secondary">
                                    {getTimeDiff(createdAt)}
                                </small>
                            </div>
                        </div>
                        <GetComments
                            showComments={showComments}
                            postId={postId}
                            userId={currentUserId}
                            commentAmount={commentAmount}
                        />
                        <CreateComment
                            userId={currentUserId}
                            postId={postId}
                            updateCommentAmount={updateCommentAmount}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

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

export default SinglePost;
