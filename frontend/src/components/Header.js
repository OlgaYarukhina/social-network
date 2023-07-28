import { Navbar, Nav, NavDropdown } from 'react-bootstrap';


function Header() {

    const logOut = async (event) => {
        event.preventDefault();

        const userId = localStorage.getItem('userId');
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
                localStorage.removeItem('userId');
                document.cookie =
                    'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=None; secure';
                window.location.href = '/login';          // navigateTo('/login'); Why it does not work here?

            } else {
                const statusMsg = await response.text();
                console.log(statusMsg);
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div>
            <Navbar bg="info" variant="light">
                <Navbar href="#home">SN</Navbar>
                <Nav className="mr-auto nav_bar_wrapper">

                </Nav>
                <Nav>
                    <NavDropdown title="Pick of user">
                        <NavDropdown.Item onClick={logOut}>Log out</NavDropdown.Item>

                    </NavDropdown>
                </Nav>
            </Navbar>
        </div>
    )
}

export default Header