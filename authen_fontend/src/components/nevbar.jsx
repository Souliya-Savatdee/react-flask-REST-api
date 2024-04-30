import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import { Link, useNavigate } from "react-router-dom";


// import { useAuth, logout } from "../middleware/auth";


function LoggedInLinks() {
  return (
    <>
      <Nav.Link as={Link} to="/">
        Home
      </Nav.Link>

      <Nav.Link as={Link} to="/create_recipe">
        Create Recipe
      </Nav.Link>

      <Nav.Link
        as={Link}
        to="/#"
        onClick={() => {
          logout();
        }}
      >
        Log Out
      </Nav.Link>
    </>
  );
}

function logout(){
  localStorage.clear()
  useNavigate('/')
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


function NavBar() {
  // const [logged] = useAuth();
  const isToken = localStorage.getItem("access_token");
  
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
            {isToken ? <LoggedInLinks /> : <LoggedOutLinks />}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
