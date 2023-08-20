import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SingleNotification({
    notificationId,
    sourceId,
    notificationType,
    clickedOn,
    created,
}) {
    const navigateTo = useNavigate();

    const getNotificationMsg = () => {
        switch (notificationType) {
            case "comment":
                return "Someone left a comment on your post!";
        }
    };

    const handleNotificationClick = () => {
        switch (notificationType) {
            case "comment":
                navigateTo(`/post/${sourceId}`);
                break;
        }
    };

    return (
        <Dropdown.Item key={notificationId} onClick={handleNotificationClick}>
            <div>{getNotificationMsg()}</div>
        </Dropdown.Item>
    );
}

export default SingleNotification;
