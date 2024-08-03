import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const url = `${process.env.REACT_APP_API_URL}users/adduser`;  

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const submitRegistration = async (values, { setSubmitting }) => {
    setError(null);
    setSuccessMessage(null);

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(url, {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (response.status === 201) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response && error.response.status === 409) {
        setError("User already registered. Please log in.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="login product footer-padding">
        <div className="container">
          <Formik initialValues={initialValues} onSubmit={submitRegistration}>
            {({ isSubmitting }) => (
              <Form className="login-section">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="login-form">
                      <div className="review-form box-shadows">
                        <div className="review-form-text">
                          <h5 className="comment-title">Sign Up</h5>
                          <img
                            src="assets/images/homepage-one/vector-line.png"
                            alt="img"
                          />
                        </div>
                        <div className="review-inner-form">
                          <div className="review-form-name">
                            <label htmlFor="name" className="form-label">
                              Name*
                            </label>
                            <Field
                              type="text"
                              id="name"
                              name="name"
                              className="form-control"
                              placeholder="Name"
                              required
                            />
                          </div>
                          <div className="review-form-name">
                            <label htmlFor="email" className="form-label">
                              Email Address*
                            </label>
                            <Field
                              type="email"
                              id="email"
                              name="email"
                              className="form-control"
                              placeholder="Email"
                              required
                            />
                          </div>
                          <div className="review-form-name">
                            <label htmlFor="password" className="form-label">
                              Password*
                            </label>
                            <Field
                              type="password"
                              id="password"
                              name="password"
                              className="form-control"
                              placeholder="Password"
                              required
                            />
                          </div>
                          <div className="review-form-name">
                            <label htmlFor="confirmPassword" className="form-label">
                              Confirm Password*
                            </label>
                            <Field
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              className="form-control"
                              placeholder="Confirm Password"
                              required
                            />
                          </div>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        {successMessage && <div className="success-message">{successMessage}</div>}
                        <div className="login-btn text-center">
                          <button
                            type="submit"
                            className="shop-btn"
                            disabled={isSubmitting}
                          >
                            Sign Up
                          </button>
                          <span className="shop-account">
                            Already have an account? <Link to="/login">Log In</Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="login-img">
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

export default Register;
