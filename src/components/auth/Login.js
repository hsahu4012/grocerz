import React, { useState, useContext } from "react";
import { Formik, Field, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { DataAppContext } from "../../DataContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate(); 
  const { login_user } = useContext(DataAppContext);
  const [error, setError] = useState(null);
  const url = `${process.env.REACT_APP_API_URL}users/login`;
  // "http://localhost:4000/users/login"
  
  const initialValues = {
    username: "",
    password: ""
  };

  const submitLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        url,
        values
      );

      if (response.status === 202) {
        console.log(response.data);
        const token = response.data.token;
        localStorage.setItem("jwttoken", token); 
        localStorage.setItem("userid", response.data.userId); 
        login_user(); 
        navigate("/home"); 
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.status === 422) {
        setError("User not found. Please check your credentials.");
      } else if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else if (error.message === "Network Error") {
        setError("Network error occurred. Please try again later.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <div className="container">
      <Formik initialValues={initialValues} onSubmit={submitLogin}>
        {({ isSubmitting }) => (
          <Form>
            <div className="text-center mt-5">
              <h3>--Login Here--</h3>
            </div>
            <div className="form-group row justify-content-center">
              <label className="col-sm-3 col-form-label text-sm-right font-weight-bold mt-3">
                Username
              </label>
              <div className="col-sm-6 mt-3">
                <Field
                  name="username"
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  required
                />
              </div>
            </div>
            <div className="form-group row justify-content-center">
              <label className="col-sm-3 col-form-label text-sm-right font-weight-bold mt-3">
                Password
              </label>
              <div className="col-sm-6 mt-3">
                <Field
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  required
                />
              </div>
            </div>
            <div className="text-center mt-3">
              <button
                type="submit"
                className="btn btn-danger"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </div>
            {error && (
              <div className="text-center mt-3">
                <p className="text-danger">{error}</p>
              </div>
            )}
            <div className="text-center mt-3">
              <Link to="/register" className="text-decoration-none">
                <p className="text-success">
                  Create an account?<span> Sign Up</span>
                </p>
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    </>
  );
};

export default Login;
