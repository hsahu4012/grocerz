import React from "react";
import { Formik, Field, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const FormValues = {
    name: "",
    email: "",
    mobile: "",
    password: "",
  };

  const submitWishlist = async (values) => {
    await axios.post("http://localhost:4000/users/adduser", values);
    navigate("/login");
  };

  return (
    <div className="container">
      <Formik
        enableReinitialize={true}
        initialValues={FormValues}
        onSubmit={(values) => submitWishlist(values)}
      >
        <Form>
          <div className="text-center mt-5">
            <h3>Register Here</h3>
          </div>
          <div className="form-group row justify-content-center">
            <label className="col-sm-3 col-form-label text-sm-right font-weight-bold mt-3">
              Name
            </label>
            <div className="col-sm-6 mt-3">
              <Field name="name" type="text" className="form-control" placeholder="Enter Your Name"/>
            </div>
          </div>
          <div className="form-group row justify-content-center">
            <label className="col-sm-3 col-form-label text-sm-right font-weight-bold mt-3">
              Email
            </label>
            <div className="col-sm-6 mt-3">
              <Field name="email" type="text" className="form-control" placeholder="Enter Your Email"/>
            </div>
          </div>
          <div className="form-group row justify-content-center">
            <label className="col-sm-3 col-form-label text-sm-right font-weight-bold mt-3">
              Mobile
            </label>
            <div className="col-sm-6 mt-3">
              <Field name="mobile" type="text" className="form-control" placeholder="Enter Your Mobile No."/>
            </div>
          </div>
          <div className="form-group row justify-content-center">
            <label className="col-sm-3 col-form-label text-sm-right font-weight-bold mt-3">
              Password
            </label>
            <div className="col-sm-6 mt-3">
              <Field name="password" type="password" className="form-control" placeholder="SET Your Password"/>
            </div>
          </div>
          <div className="text-center mt-3">
            <button type="submit" className="btn btn-danger">
              SignUp
            </button>
            <div className="text-decoration-none mt-3">
              <Link to="/login" className="text-decoration-none">
                <p className="text-success">
                  Already have a account?<span>LogIn</span>
                </p>
              </Link>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
