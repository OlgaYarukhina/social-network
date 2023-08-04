import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Popup from "./Popup";
import { useOutletContext, useParams } from "react-router-dom";

function User() {
    const [profileData, setProfileData] = useState({});
    const [isProfileOwner, setIsProfileOwner] = useState(false);

    const [currentUserFollowStatus, setCurrentUserFollowStatus] = useState("");
    const { userId } = useParams();

    const sessionData = useOutletContext();
    const currentUserId = sessionData.userData.userId;

    const [showFollowersPopup, setShowFollowersPopup] = useState(false);
    const [showFollowingPopup, setShowFollowingPopup] = useState(false);

    useEffect(() => {
        setIsProfileOwner(currentUserId === userId);

        const getProfileData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-user-data?userId=${userId}&currentUserId=${currentUserId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setCurrentUserFollowStatus(data.currentUserFollowStatus);
                    setProfileData(data);
                } else {
                    console.log(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        };

        getProfileData();
    }, [currentUserId, userId, currentUserFollowStatus]);

    const handleFollow = () => {
        if (currentUserFollowStatus === "Follow") {
            sendFollowRequest(profileData.public ? "Follow" : "RequestFollow", parseInt(userId), parseInt(currentUserId));
            setCurrentUserFollowStatus(
                profileData.public ? "Following" : "Requested"
            );
        } else {
            sendFollowRequest("Unfollow", parseInt(userId), parseInt(currentUserId));
            setCurrentUserFollowStatus("Follow");
        }
    };

    if (Array.isArray(profileData.followers) && Array.isArray(profileData.following)) {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-4">
                        <img
                            className="profile-pic m-3"
                            src={`http://localhost:8080/get-image/users/${profileData.profilePic}`}
                            style={{
                                height: "150px",
                                width: "150px",
                                borderRadius: "100%",
                                objectFit: "cover",
                                zIndex: "99999",
                            }}
                            alt="profile"
                        />
                        <h4>
                            {profileData.firstName + " " + profileData.lastName}{" "}
                            {profileData.nickname && (
                                <small className="text-muted">
                                    ({profileData.nickname})
                                </small>
                            )}
                        </h4>
                        {!isProfileOwner && (
                            <Button
                                onClick={handleFollow}
                                variant={
                                    currentUserFollowStatus === "Follow"
                                        ? "primary"
                                        : "success"
                                }
                            >
                                {currentUserFollowStatus}
                            </Button>
                        )}
                        <br></br>
                        <p>Born: {profileData.dateOfBirth}</p>
                        <p>Email: {profileData.email}</p>
                        {profileData.aboutMe && (
                            <p>About me: {profileData.aboutMe}</p>
                        )}
                        <span
                            style={{
                                fontWeight: "bold",
                                color: "black",
                                cursor:
                                    profileData.followers.length > 0
                                        ? "pointer"
                                        : "default",
                            }}
                            onClick={() =>
                                setShowFollowersPopup(
                                    profileData.followers.length ? true : false
                                )
                            }
                        >
                            Followers {profileData.followers.length}
                        </span>{" "}
                        <span
                            style={{
                                fontWeight: "bold",
                                color: "black",
                                cursor:
                                    profileData.following.length > 0
                                        ? "pointer"
                                        : "default",
                            }}
                            onClick={() =>
                                setShowFollowingPopup(
                                    profileData.following.length ? true : false
                                )
                            }
                        >
                            Following {profileData.following.length}
                        </span>
                        <Popup
                            title="Followers"
                            users={profileData.followers}
                            show={showFollowersPopup}
                            currentUserId={currentUserId}
                            onClose={() => setShowFollowersPopup(false)}
                        />
                        <Popup
                            title="Following"
                            users={profileData.following}
                            show={showFollowingPopup}
                            currentUserId={currentUserId}
                            onClose={() => setShowFollowingPopup(false)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export const sendFollowRequest = async (followType, userId, followerId) => {
    const payload = {
        userId,
        followerId,
        followType,
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
            "http://localhost:8080/follow",
            options
        );
        if (response.ok) {
            console.log("ok");
        } else {
            const statusMsg = await response.text();
            console.log(statusMsg);
        }
    } catch (error) {
        console.error(error);
    }
};

export default User;
