import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const [formData, setFormData] = useState({
        content: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const navigateTo = useNavigate();
  

    const handleSubmit = async (event) => {
        console.log("Try create post")
        event.preventDefault();

        const payload = formData;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        };

        try {
            const response = await fetch(
                "http://localhost:8080/poster",
                options
            );
            if (response.ok) {
                navigateTo("/");  // it is easy peasy way how to show new post in page :)
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