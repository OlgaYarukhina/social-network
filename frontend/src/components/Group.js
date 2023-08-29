import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CreatePost from "./Poster";
import GetGroupPosts from "./GroupPosts";
import GroupInvitePopup from "./GroupInvitePopup";
import Popup from "./Popup";
import { Button } from "react-bootstrap";
import GroupJoinRequests from "./GroupJoinRequests";
import { sendNotification } from "./Notifications";

function Group() {
    const [groupData, setGroupData] = useState({});
    const [showFollowersPopup, setShowFollowersPopup] = useState(false);
    const [showMembersPopup, setShowMembersPopup] = useState(false);
    const [currentUserMemberStatus, setCurrentUserMemberStatus] =
        useState(null);

    const [postAmount, setPostAmount] = useState(null);
    const sessionData = useOutletContext();
    const { groupId } = useParams();
    const [dataLoaded, setDataLoaded] = useState(false);
    const [groupOwnerId, setGroupOwnerId] = useState(null);

    const navigateTo = useNavigate();

    const updatePostAmount = () => {
        setPostAmount((prevAmount) => prevAmount + 1);
    };

    const handleInvite = async (accepted) => {
        const payload = {
            groupId: parseInt(groupData.groupId),
            userId: sessionData.userData.userId,
            accepted,
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
                "http://localhost:8080/handle-group-invite",
                options
            );
            if (response.ok) {
                console.log("successfully handled group invite");
                setDataLoaded(false);
            } else {
                console.log("error handling group invite");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleJoinRequest = async () => {
        const payload = {
            groupId: parseInt(groupData.groupId),
            userId: sessionData.userData.userId,
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
                "http://localhost:8080/send-join-request",
                options
            );
            if (response.ok) {
                console.log("successfully sent join request");
                setCurrentUserMemberStatus("group_request");
                sendNotification(
                    parseInt(groupId),
                    parseInt(groupOwnerId),
                    "groupJoinRequest"
                );
            } else {
                console.log("error sending join request");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const getGroupData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-group-data?groupId=${groupId}&currentUserId=${sessionData.userData.userId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setGroupData(data);
                    setGroupOwnerId(data.userId);
                    setCurrentUserMemberStatus(data.currentUserMemberStatus);
                    setDataLoaded(true);
                } else {
                    console.log(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        };

        getGroupData();
    }, [groupId, dataLoaded]);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    {dataLoaded ? (
                        <React.Fragment>
                            <img
                                className="profile-pic m-3"
                                src={`http://localhost:8080/get-image/groups/${groupData.groupPic}`}
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
                            <h4>{groupData.groupTitle}</h4>
                            <br></br>
                            {currentUserMemberStatus === "group_invitations" ? (
                                <div className="d-flex">
                                    <Button
                                        onClick={() => handleInvite(true)}
                                        style={{
                                            marginRight: "3px",
                                            borderRadius: "100px",
                                        }}
                                        variant="success"
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        onClick={() => handleInvite(false)}
                                        style={{ borderRadius: "100px" }}
                                        variant="danger"
                                    >
                                        Decline
                                    </Button>
                                </div>
                            ) : currentUserMemberStatus === "group_request" ? (
                                <Button variant="secondary" disabled>
                                    Requested
                                </Button>
                            ) : currentUserMemberStatus === "not_a_member" ? (
                                <Button
                                    variant="primary"
                                    onClick={handleJoinRequest}
                                >
                                    Request to join
                                </Button>
                            ) : null}
                            <br></br>
                            <p>Owned by</p>
                            <div
                                className="user-info"
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    border: "1px solid grey",
                                    padding: "10px",
                                }}
                            >
                                <div
                                    style={{
                                        cursor: "pointer",
                                        marginLeft: "10px",
                                    }}
                                    className="d-flex align-items-center"
                                >
                                    <img
                                        src={`http://localhost:8080/get-image/users/${groupData.owner.profilePic}`}
                                        width="38"
                                        height="38"
                                        onClick={() =>
                                            navigateTo(
                                                `/user/${groupData.owner.userId}`
                                            )
                                        }
                                        style={{
                                            cursor: "pointer",
                                            borderRadius: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <div
                                        className="d-flex align-items-center"
                                        onClick={() => {
                                            navigateTo(
                                                `/user/${groupData.owner.userId}`
                                            );
                                        }}
                                    >
                                        <h5 style={{ marginLeft: "10px" }}>
                                            {groupData.owner.firstName +
                                                " " +
                                                groupData.owner.lastName}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <p
                                style={{
                                    fontWeight: "bold",
                                    color: "black",
                                    cursor:
                                        groupData.members.length > 0
                                            ? "pointer"
                                            : "default",
                                }}
                                onClick={() =>
                                    setShowMembersPopup(
                                        groupData.members.length ? true : false
                                    )
                                }
                            >
                                Members: {groupData.members.length}
                            </p>
                            <br></br>
                            <p>About: {groupData.groupDescription}</p>
                        </React.Fragment>
                    ) : (
                        <p>Loading group data...</p>
                    )}
                    <div
                        className="d-flex align-items-center"
                        style={{
                            marginTop: "40px",
                            marginBottom: "40px",
                        }}
                    >
                        <div className="font-weight-bold">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={() => setShowFollowersPopup(true)}
                            >
                                <span className="btn goups-in-icon"></span>
                                Invite members
                            </button>
                        </div>
                    </div>
                    {currentUserMemberStatus === "owner" ? (
                        <GroupJoinRequests
                            groupId={groupId}
                            setDataLoaded={setDataLoaded}
                        />
                    ) : null}
                </div>
                <GroupInvitePopup
                    title={"Invite users"}
                    show={showFollowersPopup}
                    currentUserId={sessionData.userData.userId}
                    onClose={() => setShowFollowersPopup(false)}
                    groupId={groupId}
                />
                {groupData.members ? (
                    <Popup
                        title="Members"
                        users={groupData.members}
                        show={showMembersPopup}
                        currentUserId={sessionData.userData.userId}
                        onClose={() => setShowMembersPopup(false)}
                    />
                ) : null}
                {currentUserMemberStatus === "owner" ||
                currentUserMemberStatus === "group_members" ? (
                    <div className="col-md-7">
                        <CreatePost
                            userId={sessionData.userData.userId}
                            isGroup={true}
                            groupId={groupId}
                            updatePostAmount={updatePostAmount}
                        />
                        <GetGroupPosts
                            groupId={groupId}
                            postAmount={postAmount}
                        />
                    </div>
                ) : (
                    <h1 style={{ marginTop: "50px", color: "grey" }}>
                        Posts are only visible to members
                    </h1>
                )}
            </div>
        </div>
    );
}

export default Group;
