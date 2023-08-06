import { useOutletContext } from "react-router-dom";
import ChatSidebarUser from "./ChatSidebarUser";

function ChatSidebar() {
    const sessionData = useOutletContext();
    const chattableUsers = sessionData.userData.chattableUsers;

    if (chattableUsers) {
        return (
            <div style={{ position: "fixed" }}>
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
