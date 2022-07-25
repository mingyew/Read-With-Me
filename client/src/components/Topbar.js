import React from "react";

import {
  Navbar,
  Nav,
  Container,
  Form,
  Button,
  NavDropdown,
  FormControl,
} from "react-bootstrap";

const Topbar = () => {
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="py-3"
      bg="dark"
      variant="dark"
      style={{
        borderBottom: "1px solid gray",
      }}
    >
      <Container>
        <Navbar.Brand href="#home">Read With Me</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
          </Form>
          <Button variant="warning">Sign In</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Topbar;
