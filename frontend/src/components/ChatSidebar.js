import { useEffect, useState } from "react";
import ChatSidebarUser from "./ChatSidebarUser";

function ChatSidebar({ userId }) {
    const [chattableUsers, setChattableUsers] = useState(null);

    useEffect(() => {
        const getChattableUsers = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/get-chatbar-data?userId=${userId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setChattableUsers(data);
                } else {
                    console.error(
                        "Failed to fetch chattable users:",
                        response.status
                    );
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        console.log(chattableUsers);

        getChattableUsers();
    }, []);

    if (chattableUsers) {
        return (
            <div style={{position: "fixed"}}>
                <div className="d-flex align-items-center">
                    <hr className="flex-grow-1 m-1" />
                    <div className="p-2 font-weight-bold">
                        Users you can chat with:
                    </div>
                    <hr className="flex-grow-1 m-1" />
                </div>
                {chattableUsers.length > 0 ? (
                    chattableUsers.map((user) => (
                        <ChatSidebarUser
                            key={user.userId}
                            userId={user.userId}
                            firstName={user.firstName}
                            lastName={user.lastName}
                            nickname={user.nickname}
                            profilePic={user.profilePic}
                        />
                    ))
                ) : (
                    <div>Loading posts...</div>
                )}
            </div>
        );
    }
}

export default ChatSidebar;
