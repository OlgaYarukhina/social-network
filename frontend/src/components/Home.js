import React, { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import GetPosts from "./Posts";
import CreatePost from "./CreatePosts";

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
                <CreatePost /> 
                <GetPosts /> 
            </>
        );
    }
}

export default Home;
