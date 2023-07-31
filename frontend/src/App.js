import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { hasSession } from "./components/Auth";
import Header from "./components/Header";

function App() {
    const [sessionExists, setSessionExists] = useState(null);

    useEffect(() => {
        hasSession().then((isAuthorized) => {
            setSessionExists(isAuthorized);
        });
    }, []);

    if (sessionExists === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {sessionExists ? <Header /> : null}
            <Outlet context={sessionExists} />
        </>
    );
}

export default App;
