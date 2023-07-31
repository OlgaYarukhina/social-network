import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function Header() {
    const navigateTo = useNavigate();
    const userId = localStorage.getItem("userId");

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
                localStorage.removeItem("userId");
                document.cookie =
                    "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=None; secure";
                window.location.href = "/login"; // navigateTo('/login'); Why it does not work here?
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
            <Navbar bg="info" variant="light">
                <Navbar href="#home">SN</Navbar>
                <Nav className="mr-auto nav_bar_wrapper"></Nav>
                <Nav>
                    <SearchBar onSearch={handleSearch} />
                    <NavDropdown title="Pick of user">
                        <NavDropdown.Item onClick={logOut}>
                            Log out
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            onClick={() => {
                                navigateTo(`/user/${userId}`);
                            }}
                        >
                            My profile
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar>
        </div>
    );
}

export default Header;
