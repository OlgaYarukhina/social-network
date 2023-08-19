import { useNavigate } from "react-router-dom";

function GroupsSidebarGroup({
    userId,
    groupId,
    title,
    groupPic,
    isOwner,
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
                        src={`http://localhost:8080/get-image/groups/${groupPic}`}
                        width="38"
                        height="38"
                    />
                    <div className="d-flex align-items-center"
                        onClick={() => {
                            navigateTo(`/group/${groupId}`);
                        }}
                    >
                        <h5 style={{marginLeft: "10px"}}>
                            { title }
                        </h5>
                    </div>
                    {isOwner ? (
                          <img
                          src={`http://localhost:3000/icons/Star_72px.png`}
                          width="20"
                          height="20"
                          marginLeft="30px"
                      />
                         ) : (
                         null
                    )}
                </div>
            </div>
            <hr />
        </div>
    );
}

export default GroupsSidebarGroup;
