import React, { useState, useRef } from "react";

const CreatePost = ({ userId }) => {
    const [formData, setFormData] = useState({
        userId,
        content: "",
    });
    const [selectedImg, setSelectedImg] = useState(null);
    // const [uploaded, setUploaded] = useState();
    const imgPicker = useRef(null);

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
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        let payload = new FormData();
        payload.append("userId", formData.userId);
        payload.append("content", formData.content);
        if (selectedImg) {
            payload.append("img", selectedImg || "");
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
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        rows="6"
                        placeholder="What do you want you to say to this World?"
                        id="content"
                        name="content"
                        type="button"
                        value={formData.content}
                        onChange={handleChange}
                        maxLength="2000"
                        required>
                    </textarea>
                </div>

                <button
                    className="btn btn-dark"
                    type="button"
                    onClick={handleImg}>IMG</button>
                <input
                    className="hidden"
                    type="file"
                    ref={imgPicker}
                    onChange={handleChangeImg}
                    accept="image/*, .png, .jpg, .gif"
                />
                <div className="mb-3">
                    <button className="btn btn-dark" onClick={handleSubmit} type="submit">
                        Save
                    </button>
                </div>
            </form>

        </div>
    );
};

export default CreatePost;




{/* 

 */}