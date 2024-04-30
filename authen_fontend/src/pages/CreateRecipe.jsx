import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";

const CreateRecipePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const [show, setShow] = useState(false);

  //get token from localStorage
  const token = localStorage.getItem("access_token");

  const onSubmit = async (formData) => {
    console.log(formData);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/recipe/recipes",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );
      console.log("Created Successfully");
      reset();
      
    } catch (error) {
      if (error.response.status === 400) {
        console.log("Error response:", error.response.data);
      } else {
        console.log("Other error:", error.message);
      }
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
