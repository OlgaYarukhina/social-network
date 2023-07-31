import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";

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
        <Form inline onSubmit={handleSearchSubmit}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <FormControl
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={handleSearchChange}
                    style={{ marginRight: "8px" }}
                />
                <Button type="submit">Submit</Button>
            </div>
        </Form>
    );
}

export default SearchBar;
