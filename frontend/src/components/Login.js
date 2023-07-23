import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigateTo = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
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
                "http://localhost:8080/login",
                options
            );
            if (response.ok) {
                const data = await response.json();
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 7);

                document.cookie = `cookieId=${
                    data.cookieId
                }; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`;
                
                localStorage.setItem("userId", JSON.stringify(data.userId));
                navigateTo("/");
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
                    <h2 className="mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
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
                        <div className="d-grid">
                            <button
                                type="submit"
                                className="btn btn-secondary btn-block"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
