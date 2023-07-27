import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function Header() {
    const navigateTo = useNavigate();


    const logOut = async (event) => {
       event.preventDefault();
       const userId = "4";
 

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
            const data = await response.text();
            console.log(data); // Plain text response from the server

           // document.cookie

            console.log("Log out")
            localStorage.clear();
            navigateTo("/login");
         
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
            <Navbar bg="info" variant="info">
                <Navbar.Brand href ="#home">SN</Navbar.Brand>
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