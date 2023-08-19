import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import GetPosts from "./Posts";
import CreatePost from "./Poster";
import ChatSidebar from "./ChatSidebar";
import GroupsSidebar from "./GroupsSidebar";

function Home() {
    const navigateTo = useNavigate();
    const sessionData = useOutletContext();
    const [postAmount, setPostAmount] = useState(null);

    useEffect(() => {
        if (!sessionData.sessionExists) {
            navigateTo("/login");
        }
    });

    const updatePostAmount = () => {
        setPostAmount((prevAmount) => prevAmount + 1);
    };

    if (sessionData.sessionExists) {
        return (
            <>
                <div className="row" style={{margin: "auto"}}>
                <div className="col-3">
                        <GroupsSidebar userId={sessionData.userData.userId} />
                    </div>
                    <div className="col-5 posts">
                        <CreatePost
                            userId={sessionData.userData.userId}
                            updatePostAmount={updatePostAmount}
                        />
                        <GetPosts
                            userId={sessionData.userData.userId}
                            postAmount={postAmount}
                        />
                    </div>
                    <div className="col-3">
                        <ChatSidebar userId={sessionData.userData.userId} />
                    </div>
                </div>
            </>
        );
    }
}

export default Home;
