import React, { useState, useRef, useEffect } from "react";
import PopupAddPrivacy from "./PopupPrivacy";


const CreatePost = ({ userId }) => {
    const [formData, setFormData] = useState({
        userId,
        content: "",
    });
    const [selectedImg, setSelectedImg] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [showFollowersPopup, setShowFollowersPopup] = useState(false);
    const [selectedFollowers, setSelectedFollowers] = useState([]);
    const imgPicker = useRef(null);
    const textAreaRef = useRef(null);

    const handleFocus = () => {
        textAreaRef.current.style.height = `10rem`;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleChangeImg = (event) => {
        if (event.target.files.length > 0) {
            setSelectedImg(event.target.files[0]);
        } else {
            setSelectedImg(null);
        }
    };

    const handleImg = () => {
        imgPicker.current.click();
    };


    const handleFollowersSelection = (selectedIds) => {
        setSelectedFollowers(selectedIds);
    };

    const handlePrivacyClick = () => {
        setIsChecked(!isChecked);
        setShowFollowersPopup(!isChecked);
        
        if (!isChecked) {
            setSelectedFollowers([]); // Clear selected followers if switching to private
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.content && !selectedImg) {
            alert('Please add either some text or an image to create a post.');
            return;
        }

        let payload = new FormData();
        payload.append("userId", formData.userId);
        payload.append("content", formData.content);
        if (selectedImg) {
            payload.append("img", selectedImg || "");
        }
        payload.append("privacy", !isChecked ? "Public" : selectedFollowers.length === 0 ? "Private" : "Specific");
        payload.append("selectedFollowers", JSON.stringify(selectedFollowers));

        const options = {
            method: "POST",
            body: payload,
        };
        console.log(payload)

        try {
            const response = await fetch("http://localhost:8080/poster", options);
            if (response.ok) {
                window.location.href = "/";
            } else {
                const statusMsg = await response.text();
                console.log(statusMsg);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <form>
                <div className=" card-header posts">
                    <div className="mb-3">
                        <textarea
                            className="form-control textarea-resize"
                            rows="1"
                            placeholder="What do you want to say to this World?"
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            maxLength="2000"
                            ref={textAreaRef}
                            onFocus={handleFocus}
                        />
                    </div>
                    <div className="d-flex mb-2 align-items-center">
                        <div className="col-2 d-flex" >
                            <button
                                className="btn image-button"
                                onClick={handleImg}
                            />
                            <input
                                className="hidden"
                                type="file"
                                ref={imgPicker}
                                onChange={handleChangeImg}
                                accept="image/*, .png, .jpg, .gif"
                            />
                        </div>
                        <div className="col d-flex align-items-center">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={handlePrivacyClick}
                                    className="custom-checkbox"
                                />
                                <span className="checkmark"></span>
                                Only for followers
                            </label>
                        </div>
                        {isChecked && (
                            <PopupAddPrivacy
                                title="Show to individual followers?"
                                show={showFollowersPopup}
                                currentUserId={userId}
                                onClose={() => setShowFollowersPopup(false)}
                                onFollowersSelection={handleFollowersSelection}
                                selectedFollowers={selectedFollowers}
                            />
                        )}
                        <div className="d-flex" >
                            <button
                                className="btn btn-danger"
                                onClick={handleSubmit}
                                type="submit"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
