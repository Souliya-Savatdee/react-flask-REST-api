import React from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";

import useAxiosIntereptor from "../middleware/interceptors";

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const axiosPrivate = useAxiosIntereptor();

  const access_token = localStorage.getItem("access_token");

  // const [show, setShow] = useState(false);

  const onSubmit = async (formData) => {
    console.log(formData);
    try {
      const response = await axiosPrivate.post("recipe/recipes", formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(access_token)}`,
        },
      });
      console.log("Created Successfully");
      reset();
    } catch (error) {
      console.log("Other errors : ", error.message);
      console.log("Token is expired, Clear all tokens, Please try again");

      //redirect to login
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  return (
    <div className="create-recipe page container">
      <h1>CreateRecipe Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            placeholder="Enter Title"
            {...register("description", { required: true, maxLength: 255 })}
          />
          {errors.description && (
            <small style={{ color: "red" }}>Description is required</small>
          )}
          {errors.description?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Max characters should be less than 255 characters</small>
            </p>
          )}
        </Form.Group>
        <br />

        <Button variant="primary" type="submit">
          Save
        </Button>
      </form>
    </div>
  );
};

export default CreateRecipePage;
