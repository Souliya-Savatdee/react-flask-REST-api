import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "../middleware/axios";
import { useNavigate, useLocation } from "react-router-dom";

import Recipe from "../pages/Recipe";
import useAxiosIntereptor from "../middleware/interceptors";

import useAuth from "../hooks/useAuth";

// import { jwtDecode } from "jwt-decode";

function LoggedInHome() {
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [recipeId, setRecipeId] = useState(null);
  const axiosPrivate = useAxiosIntereptor();


  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    getAllRecipes();
  }, []);

  const access_token = localStorage.getItem("access_token")|| " ";

  //Get all recipes
  const getAllRecipes = async () => {
    try {
      const response = await axios.get("recipe/recipes");
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleClose = () => setShowModal(false);

  const handleShow = (id) => () => {
    setShowModal(true);
    setRecipeId(id);
    recipes.forEach((recipe) => {
      if (recipe.id === id) {
        setValue("title", recipe.title),
          setValue("description", recipe.description);
      }
    });
  };

  //Update recipe
  const onSubmitUpdate = async (formData) => {
    console.log(formData);
    try {
      const response = await axiosPrivate.put(
        `recipe/recipe/${recipeId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(access_token)}`,
          },
        }
      );
      console.log("Updated Successfully");

      //re-update data
      getAllRecipes();
      setShowModal(false);

    } catch (error) {
      if (error?.response?.status === 400) {
        console.log("Error response:", error.response.data);
      } else {
        console.log("Other error:", error.message);
        console.log("Token is expired or Don't have token. Please try again");

        //redirect to login
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  };

  const onSubmitDelete = async (id) => {
    try {
      const response = await axiosPrivate.delete(
        `recipe/recipe/${id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(access_token)}`,
          },
        }
      );
      console.log("Deleted Successfully");
      getAllRecipes();
    } catch (error) {
      if (error?.response?.status === 400) {
        console.log("Error response:", error.response.data);
      } else {
        console.log("Other error:", error.message);
        console.log("Token is expired or Don't have token. Please try again");

        //redirect to login
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  };

  return (
    <div className="recipes page container">
      <h1>List of recipes</h1>{" "}
      <Modal show={showModal} size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Recipe</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Title"
                {...register("title", { required: true, maxLength: 25 })}
              />
              {errors.title && (
                <small style={{ color: "red" }}>Title is required</small>
              )}
              {errors.title?.type === "maxLength" && (
                <p style={{ color: "red" }}>
                  <small>Max characters should be 25 characters</small>
                </p>
              )}
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter description"
                {...register("description", {
                  required: true,
                  maxLength: 255,
                })}
              />
              {errors.description && (
                <small style={{ color: "red" }}>Description is required</small>
              )}
              {errors.description?.type === "maxLength" && (
                <p style={{ color: "red" }}>
                  <small>
                    Max characters should be less than 255 characters
                  </small>
                </p>
              )}
            </Form.Group>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmitUpdate)}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
      {recipes.map((recipe, index) => (
        <Recipe
          key={index}
          title={recipe.title}
          description={recipe.description}
          onClickChange={handleShow(recipe.id)}
          onClickDelete={() => onSubmitDelete(recipe.id)}
        />
      ))}
    </div>
  );
}

function LoggedOutHome() {
  return (
    <div className="home page container">
      <h1>Welcome to the Recipes</h1>
      <Link to="/signup" className="btn btn-outline-dark">
        Get Started
      </Link>
    </div>
  );
}

function HomePage() {
  // const isToken = localStorage.getItem("access_token");
  const { auth } = useAuth();


  return <div>{auth?.access_token ? <LoggedInHome /> : <LoggedOutHome />}</div>;
}

export default HomePage;
