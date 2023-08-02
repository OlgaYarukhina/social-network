import React, { useState,  useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const [formData, setFormData] = useState({
        userId: localStorage.getItem("userId"),
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

        console.log(payload)
        console.log(payload.has("img")); 

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
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <textarea 
                    className="form-control" 
                    rows="6" 
                    placeholder="What do you want you to say to this World?" 
                    id="content" 
                    name="content" 
                    value={formData.content}
                    onChange={handleChange}
                    maxLength="2000"
                    required> 
                    </textarea>
                </div>
              
                <button 
                 className="btn btn-dark" 
                onClick={handleImg}>IMG</button>
                    <input
                        className="hidden"
                        type="file"
                        ref={imgPicker}
                        onChange={handleChangeImg}
                        accept="image/*, .png, .jpg, .gif"
                    />
                <div className="mb-3">
                    <button 
                    className="btn btn-dark" 
                    type="submit"
                    >Save
                    </button>
                </div>
            </form>
            
        </div>
    );
};

export default CreatePost;




{/* 

 */}