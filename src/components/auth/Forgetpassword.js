import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../loader/Loader';
import loaderGif from '../../assets/images/loader.gif'

const Forgetpassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}users/forget-password`,  // Corrected URL
        { email: values.email }  // Correct field name (email)
      );
      setMessage('password has been sent to your email');
    } catch (error) {
      setMessage('Error sending password, please try again');
    }

    setLoading(false);
  };

  return (
    <>
      <section className='login product footer-padding'>
        <div className='container'>
          {loading && <div className='loader-div'>
                                      <img className='loader-img'
                                        src={loaderGif}
                                        alt='Loading...'/>
                                    </div>}
          <Formik
            initialValues={{ email: '' }}  
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className='login-section'>
                <div className='row align-items-center'>
                  <div className='col-lg-6'>
                    <div className='login-form'>
                      <div className='review-form box-shadows'>
                        <div className='review-form-text'>
                          <h5 className='comment-title'>Forget password</h5>
                          <img
                            src='assets/images/homepage-one/vector-line.png'
                            alt='img'
                          />
                        </div>
                        <div className='review-inner-form'>
                          <div className='review-form-name'>
                            <label htmlFor='email' className='form-label'>
                              Email*
                            </label>
                            <Field
                              type='email'  
                              id='email'
                              name='email'
                              className='form-control'
                              placeholder='Email'
                            />
                          </div>
                        </div>
                        <div className='login-btn text-center'>
                          <button
                            type='submit'
                            className='shop-btn'
                            disabled={isSubmitting || loading}
                          >
                            Reset Password
                          </button>
                          <span className='shop-account'>
                            Don't have an account?
                            <Link to='/register'>Sign Up Free</Link>
                          </span>
                        </div>
                        {message && <p className='message'>{message}</p>}
                      </div>
                    </div>
                  </div>
                  <div className='col-lg-6'>
                    <div className='login-img'>
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

export default Forgetpassword;

