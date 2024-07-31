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
    password: "",
  };

  const submitLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(url, values);

      if (response.status === 202) {
        console.log(response.data);
        const token = response.data.token;
        localStorage.setItem("jwttoken", token);
        localStorage.setItem("userid", response.data.userId);
        login_user();
        navigate("/dashboard");
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
      <section class="login product footer-padding">
        <div class="container">
          <Formik initialValues={initialValues} onSubmit={submitLogin}>
          {({ isSubmitting }) => (
            <Form class="login-section">
              <div class="row align-items-center">
                <div class="col-lg-6">
                  <div class="login-form">
                    <div class="review-form  box-shadows">
                      <div class="review-form-text">
                        <h5 class="comment-title">Log In</h5>
                        <img
                          src="assets/images/homepage-one/vector-line.png"
                          alt="img"
                        />
                      </div>
                      <div class="review-inner-form ">
                        <div class="review-form-name">
                          <label for="username" class="form-label">
                            Username**
                          </label>
                          <Field
                            type="text"
                            id="username"
                            name="username"
                            class="form-control"
                            placeholder="Username"
                          />
                        </div>
                        <div class="review-form-name">
                          <label for="password" class="form-label">
                            Password*
                          </label>
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            class="form-control"
                            placeholder="password"
                          />
                        </div>
                        <div class="review-form-name checkbox">
                          <div class="checkbox-item">
                            <input type="checkbox" />
                            <span class="address">Remember Me</span>
                          </div>
                          <div class="forget-pass">
                            <p>Forgot password?</p>
                          </div>
                        </div>
                      </div>
                      {error && <div class="error-message">{error}</div>}
                      <div class="login-btn text-center">
                        <button
                          type="submit"
                          class="shop-btn"
                          disabled={isSubmitting}
                        >
                          Log In
                        </button>
                        <span class="shop-account">
                          Dont't have an account ?
                          <Link to="/register">Sign Up Free</Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="login-img">
                    <img
                      src="assets/images/homepage-one/account-img.webp"
                      alt="img"
                    />
                  </div>
                </div>
              </div>
            </Form>
          )}
          </Formik>
        </div>
      </section>
    </>
  );
};

export default Login;
