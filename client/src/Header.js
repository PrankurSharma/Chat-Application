import React from 'react';
import Axios from 'axios';
import { LinkContainer } from 'react-router-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

function Header({username}) {
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate('/login');
    }
    const logout = () => {
        var ans = window.confirm("Are you sure you want to logout?");
        if(ans){
            Axios.get('http://localhost:3001/api/logout').then((response) => {
                alert("Logged out successfully.");
                navigateToLogin();
            });
        }
    }
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
                <Container>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto">
                            <LinkContainer to="/">
                                <Nav.Link>
                                    Home
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/createroom">
                                <Nav.Link>
                                    Create a Room
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/joinroom">
                                <Nav.Link>
                                    Join a Room
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/addmember">
                                <Nav.Link>
                                    Add a Member to a Room
                                </Nav.Link>
                            </LinkContainer>
                        </Nav>
                        <Nav>
                            <Nav.Link disabled> Hi {username}, </Nav.Link>
                            <Nav.Link onClick={() => {
                                logout();
                            }}>
                                Logout
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br />
        </div>
    );
}

export default Header;