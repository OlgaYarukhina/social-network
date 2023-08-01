import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Popup from "./Popup";

const mockUser = {
    profilePicture: "https://img.freepik.com/free-icon/user_318-563642.jpg",
    fullName: "John Doe",
    nickname: "JD",
    dateOfBirth: "1990-01-01",
    email: "johndoe@example.com",
    aboutMe: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

function User() {
    const {
        profilePicture,
        fullName,
        nickname,
        dateOfBirth,
        email,
        aboutMe,
    } = mockUser;

    const [showFollowersPopup, setShowFollowersPopup] = useState(false);
    const [showFollowingPopup, setShowFollowingPopup] = useState(false);

    const mockFollowers = [
        { id: 1, name: "Follower 1" },
        { id: 2, name: "Follower 2" },
        { id: 3, name: "Follower 2" },
        { id: 4, name: "Follower 2" },
        { id: 5, name: "Follower 2" },
        { id: 6, name: "Follower 2" },
        { id: 7, name: "Follower 2" },
        { id: 8, name: "Follower 2" },
        { id: 9, name: "Follower 2" },
    ];

    const mockFollowing = [
        { id: 3, name: "Following 1" },
        { id: 4, name: "Following 2" },
    ];

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <img
                        className="profile-pic m-3"
                        src={profilePicture}
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
                        {fullName}{" "}
                        {nickname && (
                            <small className="text-muted">({nickname})</small>
                        )}
                    </h4>
                    <Button variant="primary" className="follow-button">
                        Follow
                    </Button><br></br>
                    <p>Born: {dateOfBirth}</p>
                    <p>Email: {email}</p>
                    {aboutMe && <p>About me: {aboutMe}</p>}
                    <Button
                        variant="primary"
                        onClick={() => setShowFollowersPopup(true)}
                    >
                        Followers {mockFollowers.length}
                    </Button>{" "}
                    <Button
                        variant="primary"
                        onClick={() => setShowFollowingPopup(true)}
                    >
                        Following {mockFollowing.length}
                    </Button>
                    <Popup
                        title="Followers"
                        users={mockFollowers}
                        show={showFollowersPopup}
                        onClose={() => setShowFollowersPopup(false)}
                    />
                    <Popup
                        title="Following"
                        users={mockFollowing}
                        show={showFollowingPopup}
                        onClose={() => setShowFollowingPopup(false)}
                    />
                </div>
            </div>
        </div>
    );
}

export default User;
