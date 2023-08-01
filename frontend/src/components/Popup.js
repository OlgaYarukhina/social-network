import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Popup = ({ title, users, show, onClose }) => {
    const navigateTo = useNavigate();
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "50vh", overflowY: "auto" }}>
                {users.map((user) => (
                    <div key={user.id}>
                        <div className="user-info">
                            <div
                                onClick={() => {
                                    navigateTo(`/user/${user.id}`);
                                    onClose()
                                }}
                                style={{cursor: "pointer"}}
                            >
                                <h5>{user.name}</h5>
                            </div>
                            <Button variant="primary" className="follow-button">
                                Follow
                            </Button>
                        </div>
                        <hr />
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Popup;
