import React, { useState } from 'react';

import axios from 'axios';

const QuickFeedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const stars = [1, 2, 3, 4, 5];

  function handleRating(star) {
    setRating(star);
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // console.log(`mobile = ${mobile}, message = ${message}, rating = ${rating}`);
  }

  return (
    <>
      <section class='blog about-blog'>
        <div class='container'>
          <div class='blog-heading about-heading'>
            <h1 class='heading'>Feedback</h1>
          </div>
        </div>
      </section>

      <section class='contact product footer-padding'>
        <div class='container'>
          <div class='contact-section'>
            <div class='row'>
              <div class='col-lg-6'>
                <div class='question-section login-section'>
                  <div class='review-form box-shadows'>
                    <div class='review-form-text'>
                      <h1 class='heading-custom-font-1'>Send Quick Feedback</h1>
                    </div>
                    <form onSubmit={handleSubmit} className='d-flex flex-column gap-4'>
                    <div className='d-flex w-100 justify-content-evenly px-2 align-items-center'>
                        <div className='fs-3'>
                          Rating :
                        </div>
                        <div className='d-flex justify-content-center align-items-center'>
                        {stars.map((star, index) => (
                          <span
                            key={index}
                            className='cursor-pointer fs-4 mx-3'
                            style={{
                              color:
                                hover >= star || rating >= star
                                  ? '#f39c12'
                                  : '#6c757d',
                              transition: 'color 0.2s',
                              transform: 'scale(2)',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      </div>
                      <div class='account-inner-form'>
                        <div class='review-form-name'>
                          <input
                            name='mobile'
                            type='tel'
                            id='mobile'
                            class='form-control'
                            placeholder='Mobile'
                            value={mobile}
                            onChange={e => setMobile(e.target.value)}
                          />
                        </div>
                        <div class='review-form-name'></div>
                      </div>

                      <div class='review-textarea'>
                        <textarea
                          name='message'
                          class='form-control'
                          placeholder='Write Your Feedback...........'
                          id='floatingTextarea'
                          rows='3'
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                        ></textarea>
                      </div>
                      <button type='submit' className='shop-btn login-btn'>
                        Send Feedback
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default QuickFeedback;