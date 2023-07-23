import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        nickname: "",
        dateOfBirth: "",
        password: "",
        confirmPassword: "",
        aboutMe: "",
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
        event.preventDefault();

        const payload = formData;
        payload.profilePic = "defaultProfilePic.png";

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        };

        try {
            const response = await fetch(
                "http://localhost:8080/register",
                options
            );
            if (response.ok) {
                console.log("user added");
                navigateTo("/login");
            } else {
                const statusMsg = await response.text();
                console.log(statusMsg);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-5 bg-dark text-light p-4 rounded">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <h2 className="mb-4">Registration</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">
                                First Name
                            </label>
                            <input
                                type="text"
                                className="form-control bg-dark text-light border-light"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">
                                Last Name
                            </label>
                            <input
                                type="text"
                                className="form-control bg-dark text-light border-light"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control bg-dark text-light border-light"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nickname" className="form-label">
                                Nickname (optional)
                            </label>
                            <input
                                type="text"
                                className="form-control bg-dark text-light border-light"
                                id="nickname"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dateOfBirth" className="form-label">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                className="form-control bg-dark text-light border-light"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control bg-dark text-light border-light"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="confirmPassword"
                                className="form-label"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="form-control bg-dark text-light border-light"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="aboutMe" className="form-label">
                                About Me (optional, max 100 characters)
                            </label>
                            <textarea
                                className="form-control bg-dark text-light border-light"
                                id="aboutMe"
                                name="aboutMe"
                                value={formData.aboutMe}
                                onChange={handleChange}
                                maxLength="100"
                                style={{ minHeight: "100px" }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-secondary btn-block"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
