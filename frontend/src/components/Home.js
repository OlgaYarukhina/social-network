import React, { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

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
                <h1>This is the homepage view when logged in</h1>
            </>
        );
    }
}

export default Home;
