import { useState } from "react";
import { getTimeDiff } from "./Posts";

function SingleComment({
    commentId,
    userId,
    displayName,
    img,
    createdAt,
    content,
    currentUserId,
    profilePic,
}) {
    const [currentUserLike, setCurrentUserLike] = useState(false);
    const handleCommentLike = () => {
        console.log(`${currentUserId} liked the comment ${commentId}`);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="d-flex align-items-center">
                    <img
                        src={`http://localhost:8080/get-image/users/${profilePic}`}
                        alt="Profile Pic"
                        width="30"
                        height="30"
                        className="rounded-circle mr-2"
                    />
                    <div>
                        <small className="text-muted">{displayName}</small>
                        <p>{content}</p>
                    </div>
                </div>
                {img && (
                    <div className="d-flex justify-content-center mt-3">
                        <img
                            src={`http://localhost:8080/get-image/comments/${img}`}
                            style={{ maxWidth: "100%", maxHeight: "150px" }}
                        />
                    </div>
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
                            onClick={handleCommentLike}
                        ></div>
                        <small>3</small>
                    </div>
                    <small className="text-body-secondary">
                        {getTimeDiff(createdAt)}
                    </small>
                </div>
            </div>
        </div>
    );
}

export default SingleComment;
