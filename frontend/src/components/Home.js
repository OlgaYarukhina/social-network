import React, { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import GetPosts from "./Posts";

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
                <GetPosts /> 
            </>
        );
    }
}

export default Home;
