import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { sendNotification } from "./Notifications";
import CreatePost from "./Poster";
import GetGroupPosts from "./GroupPosts";
import PopupAddPrivacy from "./PopupPrivacy";



function Group() {
    const [groupData, setGroupData] = useState({});
    const [showFollowersPopup, setShowFollowersPopup] = useState(false);
    const [selectedFollowers, setSelectedFollowers] = useState([]);
    const sessionData = useOutletContext();
    const currentUserId = sessionData.userData.userId;
    const { groupId } = useParams();
   

    useEffect(() => {

        const getGroupData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-group-data?groupId=${groupId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setGroupData(data);
                } else {
                    console.log(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        };

        getGroupData();
    }, [groupId]);

    const handleFollowersSelection = (selectedIds) => {
        setSelectedFollowers(selectedIds);
    };

    


    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <img
                        className="profile-pic m-3"
                        //src={`http://localhost:8080/get-image/groups/${groupData.groupPic}`}
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
                        {groupData.groupTitle}
                    </h4>
                    <p>Owner: {groupData.owner}</p>
                    <br></br>
                    <p>About: {groupData.groupDescription}</p>
                    <div 
                            className="d-flex align-items-center"
                            style={{
                                marginTop: "40px",
                                marginBottom: "40px",
                            }}>
                            <div className="font-weight-bold">
                                
                                <button 
                                type="button" 
                                class="btn btn-light"
                                onClick={() => setShowFollowersPopup(true)}
                                >
                                <span className="btn goups-in-icon"></span>
                                Invite members
                                </button>
                            </div>
                        </div>
                        <PopupAddPrivacy
                                title="Invite friends"
                                show={showFollowersPopup}
                                currentUserId={groupData.userId}
                                onClose={() => setShowFollowersPopup(false)}
                                onFollowersSelection={handleFollowersSelection}
                                selectedFollowers={selectedFollowers}
                            />
                    <div className="p-2 font-weight-bold">
                        <div className="btn goups-icon"></div>
                        Members
                    </div>
                    {/* {groupData.groupMembers != null
                        ? groupData.members.map((group) => (
                            <ChatSidebarUser
                                key={group.groupId}
                                userId={group.userId}
                            />
                          
                        ))
                        : null} */}
                </div>
                <div className="col-md-7">
                    <CreatePost
                        userId={sessionData.userData.userId}
                        isGroup={true}
                        groupId={groupId}
                       // updatePostAmount={updatePostAmount}
                    />
                    <GetGroupPosts
                        groupId={groupId}
                    />
                </div>
            </div>
        </div>
    );

}

export default Group;
