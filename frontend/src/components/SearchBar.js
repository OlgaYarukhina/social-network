import React, { useState } from "react";
import { Dropdown, Form, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SearchBar({ onSearch }) {
    const [searchText, setSearchText] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [options, setOptions] = useState([]);

    const navigateTo = useNavigate();

    const handleSearchChange = async (event) => {
        setSearchText(event.target.value);

        if (event.target.value) {
            try {
                const response = await fetch(
                    `http://localhost:8080/search?value=${event.target.value}`
                );
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setShowOptions(data.users.length ? true : false);
                    setOptions(data.users);
                } else {
                    console.log(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setShowOptions(false);
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        onSearch(searchText);
    };

    const handleOptionSelect = (option) => {
        if (option.userId) {
            navigateTo(`/user/${option.userId}`);
        }
        setSearchText("");
        setShowOptions(false);
    };

    return (
        <Form onSubmit={handleSearchSubmit}>
            <div style={{ alignItems: "center" }}>
                <FormControl
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={handleSearchChange}
                    style={{ marginRight: "20px", width: "500px" }}
                />
                <Dropdown show={showOptions}>
                    <Dropdown.Menu style={{ width: "500px" }}>
                        {options.map((option) => (
                            <Dropdown.Item
                                key={option.userId}
                                onClick={() => handleOptionSelect(option)}
                            >
                                <div className="user-info">
                                    <div
                                        style={{
                                            marginLeft: "10px",
                                        }}
                                        className="d-flex align-items-center"
                                    >
                                        <img
                                            src={`http://localhost:8080/get-image/users/${option.profilePic}`}
                                            width="40"
                                            height="40"
                                        />
                                        <div className="d-flex align-items-center">
                                            <h5 style={{ marginLeft: "10px" }}>
                                                {(option.firstName +
                                                    " " +
                                                    option.lastName).slice(0, 15) + ((option.firstName +
                                                    " " +
                                                    option.lastName).length > 16 ? "..." : "")}
                                            </h5>
                                            <h5 style={{ marginLeft: "5px" }}>
                                                {option.nickname && (
                                                    <small className="text-muted">
                                                        ({option.nickname})
                                                    </small>
                                                )}
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="user-icon"></div>
                                </div>
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Form>
    );
}

export default SearchBar;
