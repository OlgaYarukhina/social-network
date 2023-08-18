import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";

function Header({ userId, firstName, lastName, profilePic }) {
    const navigateTo = useNavigate();

    const logOut = async (event) => {
        event.preventDefault();

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await fetch(
                `http://localhost:8080/logout?userId=${userId}`,
                options
            );
            if (response.ok) {
                document.cookie =
                    "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=None; secure";
                window.location.href = "/login";
            } else {
                const statusMsg = await response.text();
                console.log(statusMsg);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (text) => {
        console.log(text);
    };

    return (
        <div>
            <Navbar bg="info" variant="light" className="fixed-top">
                <Navbar
                    onClick={() => navigateTo("/")}
                    style={{ cursor: "pointer" }}
                >
                    SN
                </Navbar>
                <Notifications />
                <Nav className="mr-auto nav_bar_wrapper"></Nav>
                <Nav>
                    <SearchBar onSearch={handleSearch} />
                    <img
                        src={`http://localhost:8080/get-image/users/${profilePic}`}
                        alt="Small Image"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                        }}
                    />
                    <NavDropdown title={`${firstName} ${lastName} `}>
                        <NavDropdown.Item
                            onClick={() => {
                                navigateTo(`/user/${userId}`);
                            }}
                        >
                            My profile
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={logOut}>
                            Log out
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar>
        </div>
    );
}

export default Header;
