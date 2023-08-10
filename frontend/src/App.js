import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { hasSession } from "./components/Auth";
import Header from "./components/Header";

function App() {
    const [sessionExists, setSessionExists] = useState(null);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        hasSession().then((result) => {
            setSessionExists(result.isAuthorized);
            setUserData(result.user);
        });
    }, []);

    if (sessionExists === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {sessionExists ? (
                <Header
                    userId={userData.userId}
                    firstName={userData.firstName}
                    lastName={userData.lastName}
                    profilePic={userData.profilePic}
                />
            ) : null}
            <div style={{ marginTop: sessionExists ? "55px" : "0" }}>
                <Outlet context={{ sessionExists, userData }} />
            </div>
        </>
    );
}

export default App;
