import { useNavigate } from "react-router-dom";

function ChatSidebarUser({
    userId,
    firstName,
    lastName,
    nickname,
    profilePic,
}) {
    const navigateTo = useNavigate();
    return (
        <div key={userId}>
            <div className="user-info">
                <div
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                    className="d-flex align-items-center"
                >
                    <img
                        src={`http://localhost:8080/get-image/users/${profilePic}`}
                        width="50"
                        height="50"
                    />
                    <div className="d-flex align-items-center"
                        onClick={() => {
                            navigateTo(`/chat/${userId}`);
                        }}
                    >
                        <h5 style={{marginLeft: "10px"}}>
                            {firstName + " " + lastName}
                        </h5>
                        <h5 style={{marginLeft: "5px"}}>
                        {nickname && (
                                <small className="text-muted">
                                    ({nickname})
                                </small>
                            )}
                        </h5>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}

export default ChatSidebarUser;
