import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import SingleNotification from "./SingleNotification";

function Notifications({ notifications, userId }) {
    const getUnseenNotificationAmount = (notifications) => {
        var amount = 0;
        notifications.forEach((notification) => {
            if (!notification.seen) {
                amount++;
            }
        });
        return amount < 10 ? amount : "9+";
    };

    const [notificationCount, setNotificationCount] = useState(
        getUnseenNotificationAmount(notifications)
    );
    const [showNotifications, setShowNotifications] = useState(false);

    const showNotificationDropdown = () => {
        setNotificationCount("");
        setShowNotifications(!showNotifications);
        setAllNotificationsToSeen();
    };

    const setAllNotificationsToSeen = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/set-notifications-to-seen?userId=${userId}`
            );
            if (response.ok) {
                console.log("all notifications set to seen");
            } else {
                console.log(":(");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div
                className="notification-container"
                onClick={showNotificationDropdown}
            >
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
            <Dropdown show={showNotifications}>
                <Dropdown.Menu
                    style={{
                        width: "250px",
                        maxHeight: "300px",
                        overflowY: "auto",
                    }}
                >
                    {notifications.map((notification) => (
                        <SingleNotification
                            key={notification.notificationId}
                            notificationId={notification.notificationId}
                            sourceId={notification.sourceId}
                            notificationType={notification.notificationType}
                            clickedOn={notification.clickedOn}
                            created={notification.created}
                            setShowNotifications={setShowNotifications}
                        />
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}

export const sendNotification = async (
    sourceId,
    receiverId,
    notificationType
) => {
    const payload = {
        sourceId,
        receiverId,
        notificationType,
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    };

    try {
        const response = await fetch(
            "http://localhost:8080/add-notification",
            options
        );
        if (response.ok) {
            console.log("notification sent");
        } else {
            console.log(":(");
        }
    } catch (error) {
        console.error(error);
    }
};

export default Notifications;
