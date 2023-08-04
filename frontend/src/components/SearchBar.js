import React, { useState } from "react";
import { Form, FormControl } from "react-bootstrap";

function SearchBar({ onSearch }) {
    const [searchText, setSearchText] = useState("");

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        onSearch(searchText);
    };

    return (
        <Form onSubmit={handleSearchSubmit}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <FormControl
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={handleSearchChange}
                    style={{ marginRight: "20px" }}
                />
            </div>
        </Form>
    );
}

export default SearchBar;
