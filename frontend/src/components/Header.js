import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";
import { useState } from "react";
import PopupCreateGroup from "./PopupCreateGroup";

function Header({ userId, firstName, lastName, profilePic, notifications }) {
    const navigateTo = useNavigate();
    const [showCreateGroupPopup, setShowCreateGroupPopup] = useState(false);

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

    return (
        <div>
            <Navbar bg="info" variant="light" className="fixed-top">
                <Navbar className="home-button"
                    onClick={() => navigateTo("/")}
                >
                </Navbar>
                <NavDropdown
                    style={{ marginRight: "20px" }}
                    className="btn goups-in-icon"
                >
                    <NavDropdown.Item
                        onClick={() => setShowCreateGroupPopup(true)}
                    >
                        Create group
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigateTo("/groups")}>
                        Explore groups
                    </NavDropdown.Item>
                </NavDropdown>
                <Notifications notifications={notifications} userId={userId} />
                <Nav className="mr-auto nav_bar_wrapper"></Nav>
                <Nav>
                    <SearchBar />
                    <img
                        src={`http://localhost:8080/get-image/users/${profilePic}`}
                        alt="Small Image"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
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
                <PopupCreateGroup
                    title="Create group"
                    userId={userId}
                    show={showCreateGroupPopup}
                    onClose={() => setShowCreateGroupPopup(false)}
                />
            </Navbar>
        </div>
    );
}

export default Header;
