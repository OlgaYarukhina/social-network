import { useState } from "react";

function Notifications() {
    const [notificationCount, setNotificationCount] = useState("");

    return (
        <>
            <div className="notification-container">
                <div className="notification-button"></div>
                <div
                    style={{
                        visibility: notificationCount ? "visible" : "hidden",
                    }}
                    className="notification-count"
                >
                    {notificationCount}
                </div>
            </div>
        </>
    );
}

export default Notifications;
