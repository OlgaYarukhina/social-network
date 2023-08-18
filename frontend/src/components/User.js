import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { useOutletContext, useParams } from "react-router-dom";
import Popup from "./Popup";
import CreatePost from "./Poster";
import GetUserPosts from "./UserPosts.js";

function User() {
    const [profileData, setProfileData] = useState({});
    const [isProfileOwner, setIsProfileOwner] = useState(false);
    const [privacy, setPrivacy] = useState(null);
    const [followBtnVariant, setFollowBtnVariant] = useState("");

    const [currentUserFollowStatus, setCurrentUserFollowStatus] = useState("");
    const [currentUserCanView, setCurrentUserCanView] = useState(null);
    const { userId } = useParams();

    const sessionData = useOutletContext();
    const currentUserId = sessionData.userData.userId;

    const [showFollowersPopup, setShowFollowersPopup] = useState(false);
    const [showFollowingPopup, setShowFollowingPopup] = useState(false);

    useEffect(() => {
        setIsProfileOwner(currentUserId === parseInt(userId));
        console.log("Current user");
        console.log(currentUserId);

        const getProfileData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-user-data?userId=${userId}&currentUserId=${currentUserId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setPrivacy(data.public ? "Public" : "Private");
                    handleCurrentUserAuth(data);
                    setCurrentUserFollowStatus(data.currentUserFollowStatus);
                    changeBtnVariant(data.currentUserFollowStatus);
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
            sendFollowRequest(
                profileData.public ? "Follow" : "RequestFollow",
                parseInt(userId),
                parseInt(currentUserId)
            );
            setCurrentUserFollowStatus(
                profileData.public ? "Following" : "Requested"
            );
            setFollowBtnVariant(profileData.public ? "success" : "secondary");
        } else {
            sendFollowRequest(
                "Unfollow",
                parseInt(userId),
                parseInt(currentUserId)
            );
            setCurrentUserFollowStatus("Follow");
            setFollowBtnVariant("primary");
        }
    };

    const changeBtnVariant = (currentUserFollowStatus) => {
        switch (currentUserFollowStatus) {
            case "Follow":
                setFollowBtnVariant("primary");
                break;
            case "Following":
                setFollowBtnVariant("success");
                break;
            case "Requested":
                setFollowBtnVariant("secondary");
                break;
        }
    };

    const handleSelect = (option) => {
        setPrivacy(option);
        if (option !== privacy) {
            changePrivacy(option);
        }
    };

    const handleCurrentUserAuth = (data) => {
        if (
            (data.currentUserFollowStatus === "Follow" ||
                data.currentUserFollowStatus === "Requested") &&
            !isProfileOwner &&
            !data.public
        ) {
            setCurrentUserCanView(false);
        } else {
            setCurrentUserCanView(true);
        }
    };

    const changePrivacy = async (privacy) => {
        try {
            const response = await fetch(
                `http://localhost:8080/set-privacy?userId=${userId}&privacy=${privacy}`
            );
            if (response.ok) {
                console.log("Privacy status updated");
            } else {
                console.log("Privacy status update failed");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (
        Array.isArray(profileData.followers) &&
        Array.isArray(profileData.following)
    ) {
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
                                border: "black 1px solid",
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
                        {!isProfileOwner ? (
                            <Button
                                onClick={handleFollow}
                                variant={followBtnVariant}
                                disabled={
                                    currentUserFollowStatus === "Requested"
                                }
                                onMouseEnter={() =>
                                    setFollowBtnVariant(
                                        currentUserFollowStatus === "Following"
                                            ? "danger"
                                            : followBtnVariant
                                    )
                                }
                                onMouseLeave={() =>
                                    setFollowBtnVariant(
                                        currentUserFollowStatus === "Following"
                                            ? "success"
                                            : followBtnVariant
                                    )
                                }
                            >
                                {followBtnVariant === "danger"
                                    ? "Unfollow"
                                    : currentUserFollowStatus}
                            </Button>
                        ) : (
                            <Dropdown onSelect={handleSelect}>
                                <Dropdown.Toggle
                                    variant={
                                        privacy === "Public"
                                            ? "success"
                                            : "danger"
                                    }
                                    id="privacy-dropdown"
                                >
                                    {privacy}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="Public">
                                        Public
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="Private">
                                        Private
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                        {currentUserCanView ? (
                            <>
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
                                            profileData.followers.length
                                                ? true
                                                : false
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
                                            profileData.following.length
                                                ? true
                                                : false
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
                            </>
                        ) : (
                            <h4 style={{ marginTop: "10px" }}>
                                This profile is private
                            </h4>
                        )}
                    </div>
                    <div className="col-md-7">
                        {currentUserId == userId ? (
                            <CreatePost userId={sessionData.userData.userId} />
                        ) : null}
                        {currentUserCanView && (
                            <GetUserPosts
                                userId={userId}
                                currentUserId={sessionData.userData.userId}
                            />
                        )}
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
        const response = await fetch("http://localhost:8080/follow", options);
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

{
    /* <>
<div className="row">
    <div className="col-3">
        <div>Something here</div>
    </div>
    <div className="col-5 posts">
        <CreatePost userId={sessionData.userData.userId} />
        <GetPosts userId={sessionData.userData.userId} />
    </div>
    <div className="col-3">
        <ChatSidebar userId={sessionData.userData.userId}/>
    </div>
</div>
</> */
}
