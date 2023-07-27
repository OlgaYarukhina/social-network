import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { hasSession } from "./components/Auth";
import Header from "./components/Header";

function App() {
    const [sessionExists, setSessionExists] = useState(false);

    useEffect(() => {
        if (hasSession()) {
            setSessionExists(true);
        } else {
            setSessionExists(false);
        }
    }, []);

    return (
        <>
            {sessionExists ? <Header /> : null}
            <Outlet context={sessionExists} />
        </>
    );
}

export default App;
