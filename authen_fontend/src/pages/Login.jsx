import React, { useState } from "react";
import { Button, Form, InputGroup, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { login } from "../middleware/auth";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [show, setShow] = useState(false); //Alerts
  const [serverResponse, setServerResponse] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    console.log(formData);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        const access_token = response.data.access_token
        const refresh_token = response.data.refresh_token

        // login(access_token);

        localStorage.setItem("access_token",`"${access_token}"`)
        localStorage.setItem("refresh_token",`"${refresh_token}"`)



        //Redirect after Login success
        navigate("/");

        setServerResponse("");
        setShow(false);

      }

      // reset();
    } catch (error) {
      if (error.response.status === 400) {
        setServerResponse(error.response.data.message);
        console.log(serverResponse);
        setShow(true);
      } else {
        console.log("Other error:", error.message);
        setServerResponse("An error occurred. Please try again later.");
        setShow(true);
      }
    }
  };

  return (
    <div className="Login page container">
      <div className="form">
        {show ? (
          <>
            <Alert
              variant="danger"
              onClose={() => {
                setShow(false);
              }}
              dismissible
            >
              <span>{serverResponse}</span>
            </Alert>

            <h1>Login page</h1>
          </>
        ) : (
          <h1>Login page</h1>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              {...register("username", { required: true, maxLength: 25 })}
            />
            {errors.username && (
              <small style={{ color: "red" }}>Username is required</small>
            )}
            {errors.username?.type === "maxLength" && (
              <p style={{ color: "red" }}>
                <small>Username should be 25 characters</small>
              </p>
            )}
          </Form.Group>
          <br />

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              {...register("password", { required: true, minLength: 8 })}
            />
            {errors.password && (
              <small style={{ color: "red" }}>Password is required</small>
            )}
            {errors.password?.type === "maxLength" && (
              <p style={{ color: "red" }}>
                <small>Password should be more than 8 characters</small>
              </p>
            )}
          </Form.Group>
          <br />
          <Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form.Group>
          <br></br>
          <Form.Group>
            <small>
              Do not have an account? <Link to="/signup">Create One</Link>
            </small>
          </Form.Group>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
