import React, { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import GetPosts from "./Posts";
import CreatePost from "./Poster";

function Home() {
    const navigateTo = useNavigate();
    const sessionExists = useOutletContext();

    useEffect(() => {
        if (!sessionExists) {
            navigateTo("/login");
        }
    });

    if (sessionExists) {
        return (
            <>
                <div className="row">
                    <div className="col-3"> <div className="col-4">Something here</div></div>
                    <div className="col-6">
                        <CreatePost />
                        <GetPosts />
                    </div>
                    <div className="col-3"> <div className="col-4">Something here</div></div>
                </div>
            </>
        );
    }
}

export default Home;
