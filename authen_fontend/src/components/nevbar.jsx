import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { Link, useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import useAuth from "../hooks/useAuth";
import { useContext } from "react";
import AuthContext from "../context/authProvider";
// import { useAuth } from "../middleware/auth";

// const logout = async () => {


//   const navigate = useNavigate();
//   // const { logout } = useAuth();

//     localStorage.clear() // Clear the token from local storage
//     // logout();
//     navigate("/");
//     // window.location.reload();
// }



function NavBar() {
  const { auth } = useAuth();

  const accessToken = auth?.access_token || "";
  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);


  const logout = async () => {

  
      localStorage.clear() // Clear the token from local storage
      setAuth({});
      navigate("/");
      location.reload();
  }


  function LoggedOutLinks() {
    return (
      <>
        <Nav.Link as={Link} to="/">
          Home
        </Nav.Link>
  
        <Nav.Link as={Link} to="/login">
          Login
        </Nav.Link>
  
        <Nav.Link as={Link} to="/signup">
          Sign Up
        </Nav.Link>
      </>
    );
  }
  
  function LoggedInUserLinks() {
    return (
      <>
        <Nav.Link as={Link} to="/">
          Home
        </Nav.Link>
  
        <Nav.Link as={Link} to="/#" onClick={logout}>
          Log Out
        </Nav.Link>
      </>
    );
  }

  function LoggedInAdminLinks() {
    return (
      <>
        <Nav.Link as={Link} to="/">
          Home
        </Nav.Link>
  
        <Nav.Link as={Link} to="/create_recipe">
          Create Recipe
        </Nav.Link>
  
        <Nav.Link as={Link} to="/#" onClick={logout}>
          Log Out
        </Nav.Link>
      </>
    );
  }


  return (
    <Navbar
      bg="dark"
      expand="lg"
      className="bg-body-tertiary"
      data-bs-theme="dark"
    >
      <Container>
        <Navbar.Brand href="#home">Recipes</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {auth.access_token ? (
              decodedToken?.role === "admin" ? (
                <LoggedInAdminLinks />
              ) : (
                <LoggedInUserLinks />
              )
            ) : (
              <LoggedOutLinks />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
