import React, { useState, useEffect } from "react";
import GroupsSidebarGroup from "./GroupsSidebarGroup";

function GroupsSidebar({ userId }) {

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-groups?userId=${userId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setGroups(data);
                } else {
                    console.error("Failed to fetch posts:", response.status);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    });
   
        return (
            <div style={{ position: "fixed", width: "100%" }}>
                <div className="d-flex align-items-center">
                    <div className="p-2 font-weight-bold">
                        <div className="btn goups-icon"></div>
                        Groups
                    </div>
                </div>
                {groups.userGroups != null ? (
                 groups.userGroups.map((group) => (
                    <GroupsSidebarGroup
                        key={group.groupId}
                        groupId={group.groupId}
                        userId={group.userId}
                        title={group.groupTitle}
                        groupPic={group.title}
                        isOwner={true}
                    />
                ))
            ) : (
                null
            )}
                {groups.memberGroups != null ? (
                 groups.memberGroups.map((group) => (
                    <GroupsSidebarGroup
                        key={group.groupId}
                        groupId={group.groupId}
                        userId={group.userId}
                        title={group.groupTitle}
                        groupPic={group.title}
                        isOwner={false}
                    />
                ))
            ) : (
                null
            )}
            </div>
        );
    }


export default GroupsSidebar;