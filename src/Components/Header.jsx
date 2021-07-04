import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Navbar, Nav } from "react-bootstrap";

import store from "store";

import Config from "../Config";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user);

  const doLogout = () => {
      store.clearAll();
      dispatch({ type: "auth/user", payload: {} });
  }

  return (
    <Navbar expand="lg">
      <Navbar.Brand as={Link} to="/">{Config.appName}</Navbar.Brand>
      <Navbar.Toggle aria-controls="host-navbar" />
      <Navbar.Collapse id="host-navbar">
        <Nav className="mr-auto">
          <Nav.Item>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/tools">
              Tools
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Form inline>
          { Object.keys(user).length > 0 ?
            <div>
              <Button
                as={Link}
                to="/user/dashboard"
                className="mr-1"
              >
                Dashboard
              </Button>
              <Button
                onClick={doLogout}
                variant="outline-secondary"
              >
                Logout
              </Button>
            </div> :
            <div>
              <Button
                as={Link}
                to="/auth/login"
                variant="outline-secondary" 
                className="mr-1"
              >
                Login
              </Button>
              <Button
                as={Link}
                to="/auth/register"
                variant="primary"
              >
                Register
              </Button>
            </div>
          }
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;