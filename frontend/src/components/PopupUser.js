import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { sendFollowRequest } from "./User";

function PopupUser({
    userId,
    firstName,
    lastName,
    currentUserId,
    followStatus,
    isPublic,
    onClose,
    profilePic,
}) {
    const [currentUserFollowStatus, setCurrentUserFollowStatus] =
        useState(followStatus);
    const navigateTo = useNavigate();

    const handleFollow = () => {
        if (currentUserFollowStatus === "Follow") {
            sendFollowRequest(
                isPublic ? "Follow" : "RequestFollow",
                parseInt(userId),
                parseInt(currentUserId)
            );
            setCurrentUserFollowStatus(isPublic ? "Following" : "Requested");
        } else {
            sendFollowRequest(
                "Unfollow",
                parseInt(userId),
                parseInt(currentUserId)
            );
            setCurrentUserFollowStatus("Follow");
        }
    };

    return (
        <div key={userId}>
            <div className="user-info">
                <div className="d-flex align-items-center">
                    <img
                        src={`http://localhost:8080/get-image/users/${profilePic}`}
                        width="50"
                        height="50"
                    />
                    <div
                        onClick={() => {
                            navigateTo(`/user/${userId}`);
                            onClose();
                        }}
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                    >
                        <h5>{firstName + " " + lastName}</h5>
                    </div>
                </div>
                {userId != currentUserId && (
                    <Button
                        onClick={() => handleFollow(userId)}
                        variant={
                            currentUserFollowStatus === "Follow"
                                ? "primary"
                                : "success"
                        }
                    >
                        {currentUserFollowStatus}
                    </Button>
                )}
            </div>
            <hr />
        </div>
    );
}

export default PopupUser;
