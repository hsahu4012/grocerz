import React, { useState } from 'react';
import axios from 'axios';
import loaderGif from '../assets/images/loader.gif';
const Complainform = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    orderid: '',
    subject: '',
    complain_desc: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(true);
    setError(false);
    setSuccess(false);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}complains/addcomplain`,
        formData
      );
      setFormData({
        name: '',
        email: '',
        mobile: '',
        orderid: '',
        subject: '',
        complain_desc: '',
      });
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error('Error sending data:', error);
      setLoading(false);
      setError(true);

    }
  };

  return (
    <>
      <section className='blog about-blog mb-5'>
        <div className='container'>
          <div className='blog-heading about-heading text-center'>
            <h1 className='heading'>Complain Form</h1>
          </div>
        </div>
      </section>

      <div className='container mb-5 '>
        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <img
              src={loaderGif}
              alt='Loading...'
              style={{ width: '80px', height: '80px' }}
            />
          </div>
        )}
        {!loading && (
          <div className='row justify-content-center'>
            <div className='col-lg-12'>
              <div className='question-section login-section'>
                <div className='review-form box-shadows shadow-lg p-4'>
                  <div className='review-form-text mb-4'></div>
                  <form onSubmit={handleSubmit}>
                    <div className='account-inner-form'>
                      <div className='mb-3'>
                        <input
                          name='name'
                          type='text'
                          id='fname'
                          className='form-control'
                          placeholder='Name'
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className='mb-3'>
                        <input
                          name='email'
                          type='email'
                          id='email'
                          className='form-control'
                          placeholder='Email'
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className='mb-3'>
                        <input
                          name='mobile'
                          type='text'
                          id='mobile'
                          className='form-control'
                          placeholder='Mobile'
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className='mb-3'>
                        <input
                          name='orderid'
                          type='text'
                          id='orderid'
                          className='form-control'
                          placeholder='Order ID'
                          value={formData.orderid}
                          onChange={handleChange}
                        />
                      </div>
                      <div className='mb-3'>
                        <input
                          name='subject'
                          type='text'
                          id='subject'
                          className='form-control'
                          placeholder='Subject'
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className='mb-3'>
                      <textarea
                        name='complain_desc'
                        className='form-control'
                        placeholder='Write Message...........'
                        id='floatingTextarea'
                        rows='4'
                        value={formData.complain_desc}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button type='submit' className='shop-btn login-btn'>
                    Send Message
                  </button>
                  {submitted && success && (
                    <div className="alert alert-success" role="alert">
                      your complains sucessfully submitted.
                    </div>
                  )}
                  {submitted && error && (
                    <div className="alert alert-danger" role="alert">
                      Something went wrong Please try again !
                    </div>
                  )}
                  {loading && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50vh',
                      }}
                    >
                      <img
                        src={loaderGif}
                        alt='Loading...'
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>
                  )}
                  </form>
                </div>
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </>
  );
};

export default Complainform;
