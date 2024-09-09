import React, { useState, useContext, useId } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { DataAppContext } from '../../DataContext';
import axios from 'axios';
import Loader from '../loader/Loader';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Login = () => {
  const navigate = useNavigate();
  const { login_user } = useContext(DataAppContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const url = `${process.env.REACT_APP_API_URL}users/login`;
  const [showPassword, setshowPassword]= useState(false);

  const togglePasswordVisibility = () => {
    setshowPassword(!showPassword);
  };

  const initialValues = {
    username: '',
    password: '',
  };

  const submitLogin = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const response = await axios.post(url, values);

      if (response.status === 202) {
        // console.log(response.data);
        const token = response.data.token;
        localStorage.setItem('jwttoken', token);
        localStorage.setItem('userid', response.data.userId);
        localStorage.setItem('usertype', response.data.userType);
        login_user();
        AddProductsToCart();
        fetchCartItems();
        navigate('/home');
      }
    } catch (error) {
      // console.error("Login failed:", error);
      if (error.response && error.response.status === 422) {
        setError('User not found. Please check your credentials.');
      } else if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else if (error.message === 'Network Error') {
        setError('Network error occurred. Please try again later.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };
  const AddProductsToCart = async () => {
    setLoading(true);
    try {
      const userid = localStorage.getItem('userid');
      const storedCart =
        (localStorage.getItem('cart') &&
          JSON.parse(localStorage.getItem('cart'))) ||
        [];
      const cartItems = storedCart.map(item => ({
        productid: item.productid,
        quantity: item.quantity,
      }));
      for (let i = 0; i < cartItems.length; i++) {
        const { productid, quantity } = cartItems[i];
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}cart/addToCart`,
          {
            userid,
            productid,
            quantity,
          }
        );
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
      localStorage.setItem('cart', '');
    }
  };
  const fetchCartItems = async () => {
    setLoading(true);
    const userid = localStorage.getItem('userid');
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}cart/userCart/${userid}`
      );
      const items = response.data;
      const sortedItems = items
        .map(item => ({
          productid: item.productid,
          prod_name: item.prod_name,
          price: item.price,
          image: item.image,
          discount: item.discount,
        }))
        .sort((a, b) => {
          return a.prod_name.localeCompare(b.prod_name);
        });
      localStorage.setItem('cart', JSON.stringify(sortedItems));
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
    setLoading(false);
  };

  return (
    <>
      <section class='login product footer-padding'>
        <div class='container'>
          {loading && <Loader />}
          <Formik initialValues={initialValues} onSubmit={submitLogin}>
            {({ isSubmitting }) => (
              <Form class='login-section'>
                <div class='row align-items-center'>
                  <div class='col-lg-6'>
                    <div class='login-form'>
                      <div class='review-form  box-shadows'>
                        <div class='d-flex justify-content-around mb-5'>
                          <span class='shop-account'>
                            Dont't have an account?
                            <Link to='/register'>
                              {' '}
                              <button class='btn btn-warning btn-lg ps-5  ps-5 pe-5   '>
                                Register
                              </button>
                            </Link>
                          </span>
                        </div>
                        <div class='review-form-text'>
                          <h5 class='comment-title'>Log In</h5>
                          <img
                            src='assets/images/homepage-one/vector-line.png'
                            alt='img'
                          />
                        </div>
                        <div class='review-inner-form '>
                          <div class='review-form-name'>
                            <label for='username' class='form-label'>
                              Username/Mobile/Email**
                            </label>
                            <Field
                              type='text'
                              id='username'
                              name='username'
                              class='form-control'
                              placeholder='Username/Mobile/Email'
                            />
                          </div>
                          <div class='review-form-name'>
                            <label for='password' class='form-label'>
                              Password*
                            </label>
                            <div className="input-group">
                            <Field
                              type={showPassword ? "text" : "password"}
                              id='password'
                              name='password'
                              class='form-control'
                              placeholder='Password'
                            />
                            <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                              </span>
                            </div>
                          </div>
                          {/* <div class="review-form-name checkbox">
                          <div class="checkbox-item">
                            <input type="checkbox" />
                            <span class="address">Remember Me</span>
                          </div>
                          <div class="forget-pass">
                            <p>Forgot password?</p>
                          </div>
                        </div> */}
                        </div>
                        {error && <div class='error-message'>{error}</div>}
                        <div class='login-btn text-center'>
                          <button
                            type='submit'
                            class='shop-btn'
                            disabled={isSubmitting}
                          >
                            Log In
                          </button>
                          <span class='shop-account'>
                            Dont't have an account ?
                            <Link to='/register'>Sign Up Free</Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class='col-lg-6'>
                    <div class='login-img'>
                      <img
                        src='assets/images/homepage-one/account-img.webp'
                        alt='img'
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
