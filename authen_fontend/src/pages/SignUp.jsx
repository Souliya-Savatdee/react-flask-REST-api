import React, { useState } from "react";
import { Button, Form, Alert} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";


const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();


  const [show, setShow] = useState(false); //Alerts
  const [serverResponse, setServerResponse] = useState("");
  const [serverResponseStatus, setServerResponseStatus] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onSubmit = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setServerResponse(response.data.message);
      setServerResponseStatus(response.status);

      setShow(true);
      reset();
    } catch (error) {
      if (error.response.status === 400) {
        console.log("Error response:", error.response.data);
        setServerResponse(error.response.data.message);
        setServerResponseStatus(error.response.status);
        setShow(true);
      } else {
        console.log("Other error:", error.message);
        setServerResponse("An error occurred. Please try again later.");
        setServerResponseStatus(error.response.status);
        setShow(true);
      }
    }
  };

  return (
    <div className="SignUp page container">
      <div className="form">
        {show ? (
          <>
            {serverResponseStatus === 400 ? (
              <Alert
                variant="danger"
                onClose={() => setShow(false)}
                dismissible
              >
                <span>{serverResponse}</span>
              </Alert>
            ) : (
              <Alert
                variant="success"
                onClose={() => setShow(false)}
                dismissible
              >
                <span>{serverResponse}</span>
              </Alert>
            )}

            <h1>Sign Up Page</h1>
          </>
        ) : (
          <h1>Sign Up Page</h1>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              name="username"
              {...register("username", { required: true, maxLength: 25 })}
            />
            {errors.username && (
              <small style={{ color: "red" }}>Username is required</small>
            )}
            {errors.username?.type === "maxLength" && (
              <p style={{ color: "red" }}>
                <small>Max characters should be 25</small>
              </p>
            )}
          </Form.Group>
          <br />

          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              name="email"
              {...register("email", { required: true, maxLength: 80 })}
            />
            {errors.email && (
              <small style={{ color: "red" }}>Email is required</small>
            )}
            {errors.email?.type === "maxLength" && (
              <p style={{ color: "red" }}>
                <small>Max characters should be 80</small>
              </p>
            )}
          </Form.Group>
          <br />

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              name="password"
              {...register("password", { required: true, minLength: 8 })}
            />
            {errors.password && (
              <small style={{ color: "red" }}>Password is required</small>
            )}
            {errors.password?.type === "minLength" && (
              <p style={{ color: "red" }}>
                <small>Min characters should be 8</small>
              </p>
            )}
          </Form.Group>
          <br />

          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              {...register("confirmPassword", {
                required: true,
              })}
            />
            {errors.confirmPassword && (
              <small style={{ color: "red" }}>
                Confirm Password is required
              </small>
            )}
            {passwordError && (
              <p style={{ color: "red" }}>
                <small style={{ color: "red" }}>{passwordError}</small>
              </p>
            )}
          </Form.Group>
          <br />

          <Button variant="primary" type="submit">
            Sign Up
          </Button>

          <br />
          <small>
            Already have an account, <Link to="/login">Log In</Link>
          </small>
        </form>
      </div>
    </div>


  );
};

export default SignUp;
