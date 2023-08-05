import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreateComment = ({ userId }) => {
    const [formData, setFormData] = useState({
        userId,
        content: "",
    });
    const [selectedImg, setSelectedImg] = useState(null);
    // const [uploaded, setUploaded] = useState();
    const imgPicker = useRef(null);
    const navigateTo = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleChangeImg = (event) => {
        setSelectedImg(event.target.files[0])
    };

    const handleImg = () => {
        imgPicker.current.click();
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        let payload = new FormData();
        payload.append("userId", formData.userId);
        payload.append("content", formData.content);
        if (selectedImg) {
            payload.append('img', selectedImg);
        };

        const options = {
            method: "POST",
            body: payload,
        };

        try {
            const response = await fetch(
                "http://localhost:8080/poster",
                options
            );
            if (response.ok) {
                navigateTo("/");  // Why it does not work?
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
            <div className="card card-body">
                <form onSubmit={handleSubmit}>
                    <div className="d-flex align-items-center">
                        <img
                            src={"https://cdn-icons-png.flaticon.com/512/6065/6065522.png"}
                            width="30"
                            height="30"
                        />
                        <div className="col d-flex" >
                            <textarea
                                className="form-control"
                                rows="1"
                                placeholder="Leave comment..."
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                maxLength="100"
                                required>
                            </textarea>
                        </div>
                        <div>
                            <button
                                className="btn image-comment-button"
                                onClick={handleImg}></button>
                            <input
                                className="hidden"
                                type="file"
                                ref={imgPicker}
                                onChange={handleChangeImg}
                                accept="image/*, .png, .jpg, .gif"
                            />
                        </div>
                        <div>
                            <button
                                className="btn send-comment-button"
                                type="submit"
                            >
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateComment;




{/* 

 */}