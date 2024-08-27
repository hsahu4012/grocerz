import React ,{useState} from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

const GuestAddess = ( { formData,setFormData, error,setError ,handleSubmit}) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fillpindetails = () => {
    if (formData.pin === '848210') {
      setError('')
      setFormData((prevState) => ({
        ...prevState,
        city: 'Rosera',
        state: 'Bihar',
        country: 'India'
      }));
    }
    else {
      setError('Sorry! We do not serve in this area.')
    }
  }

  return (
                                <div className="container m-auto ">
                                  <div className="col-lg-15">
                                    <form onSubmit={handleSubmit} className="checkout__form">
                                      <div className="row">
                                        <div className="col-lg-12">
                                          
                                          <div className="row review-form">
                                            <div className="col-lg-12 add-form">
                                            <h5>Add Details To Order</h5>
                                              <div className="checkout__form__input">
                                                <p>Name <span>*</span></p>
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Address<span>*</span></p>
                                                <input type="text" name="line1" value={formData.line1} onChange={handleChange} className="form-control" />
                                              </div>

                                              <div className="checkout__form__input">
                                                <p>Landmark</p>
                                                <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="form-control" />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Pin <span>*</span></p>
                                                <input type="text" name="pin" value={formData.pin} onChange={handleChange} onBlur={fillpindetails} className="form-control" />
                                              </div>

                                              <div className="checkout__form__input ">
                                                <p>City <span>*</span></p>
                                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" disabled />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>State <span>*</span></p>
                                                <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" disabled />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Country <span>*</span></p>
                                                <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-control" disabled />
                                              </div>

                                              <div className="checkout__form__input">
                                                <p>Contact <span>*</span></p>
                                                <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="form-control" />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Alternate Contact</p>
                                                <input type="text" name="alternatecontact" value={formData.alternatecontact} onChange={handleChange} className="form-control " />
                                              </div>

                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {
                                        error &&
                                        <div class="alert alert-danger" role="alert">
                                          {error}
                                        </div>
                                      }
                                    </form>
                                  </div>
                                </div>
  )
}

export default GuestAddess
