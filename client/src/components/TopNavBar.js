import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Navbar,
  Nav,
  Container,
  Button,
  NavDropdown,
  Alert,
} from "react-bootstrap";

const TopNavBar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate.push("/login");
    } catch {
      <Alert variant="danger">Failed to log out</Alert>;
    }
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="py-3"
      bg="dark"
      variant="dark"
      style={{
        borderBottom: "1px solid black",
      }}
    >
      <Container>
        <Navbar.Brand href="/">Read With Me</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/stories">Explore Stories</Nav.Link>
          </Nav>
          <Nav>
            {!currentUser && (
              <React.Fragment>
                <Button variant="outline-light" className="me-2" href="/login">
                  Login
                </Button>
                <Button variant="warning" href="/signup">
                  Sign In
                </Button>
              </React.Fragment>
            )}
            {currentUser && (
              <NavDropdown title={currentUser.email}>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavBar;
