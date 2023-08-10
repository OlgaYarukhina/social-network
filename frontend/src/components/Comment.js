import React, { useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const CreateComment = ({ userId, postId, updateCommentAmount }) => {
    const [formData, setFormData] = useState({
        userId,
        postId,
        content: "",
    });
    const [selectedImg, setSelectedImg] = useState(null);
    // const [uploaded, setUploaded] = useState();
    const imgPicker = useRef(null);

    const sessionData = useOutletContext();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleChangeImg = (event) => {
        setSelectedImg(event.target.files[0]);
    };

    const handleImg = () => {
        imgPicker.current.click();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let payload = new FormData();
        payload.append("userId", formData.userId);
        payload.append("postId", formData.postId);
        payload.append("content", formData.content);
        if (selectedImg) {
            payload.append("img", selectedImg);
        }

        setFormData({ userId, postId, content: "" });

        const options = {
            method: "POST",
            body: payload,
        };

        try {
            const response = await fetch(
                "http://localhost:8080/create-comment",
                options
            );
            if (response.ok) {
                updateCommentAmount();
                console.log("posted");
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
                            src={`http://localhost:8080/get-image/users/${sessionData.userData.profilePic}`}
                            width="30"
                            height="30"
                            style={{borderRadius: "100%"}}
                        />
                        <div className="col d-flex">
                            <textarea
                                className="form-control"
                                rows="1"
                                placeholder="Leave comment..."
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                maxLength="100"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <button
                                className="btn image-comment-button"
                                onClick={handleImg}
                            ></button>
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
                            ></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateComment;

{
    /* 

 */
}
