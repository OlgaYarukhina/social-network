import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

const PopupCreateGroup = ({ userId, title, show, onClose }) => {
    const [groupTitle, setGroupTitle] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [uploadedImage, setUploadedImage] = useState(null);

    const navigateTo = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        let payload = new FormData();
        payload.append("userId", userId);
        payload.append("groupTitle", groupTitle);
        payload.append("groupDescription", groupDescription);
        if (uploadedImage) {
            payload.append("img", uploadedImage || "");
        }

        const options = {
            method: "POST",
            body: payload,
        };

        try {
            const response = await fetch(
                "http://localhost:8080/create-group",
                options
            );
            if (response.ok) {
                const newGroup = await response.json();
                navigateTo(`/group/${newGroup.groupId}`);
                console.log(newGroup)
            } else {
                console.log("Error creating group:", response.status);
                const statusMsg = await response.text();
                console.log(statusMsg);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header style={{ backgroundColor: "lightgray", color: "rgb(41, 16, 93)" }}>
                <Modal.Title>{title}</Modal.Title>
                <button type="button" className="close" aria-label="Close" onClick={onClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleCreateGroup}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            placeholder="Max 20 symbols"
                            value={groupTitle}
                            onChange={(e) => setGroupTitle(e.target.value)}
                            maxLength={30}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            rows="3"
                            placeholder="Max 600 symbols"
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            maxLength={600}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="groupImage">Group Image</label>
                        <input
                            type="file"
                            className="form-control-file"
                            id="groupImage"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e)}
                        />
                    </div>
                    {/* Add a preview for the uploaded image */}
                    {uploadedImage && (
                        <div className="form-group">
                            <img src={uploadedImage} alt="Group" style={{ maxWidth: '80px' }} />
                        </div>
                    )}
                    <button type="submit" className="btn btn-danger">Create Group</button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default PopupCreateGroup;