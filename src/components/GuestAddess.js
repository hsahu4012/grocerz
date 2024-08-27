import React from 'react'

const GuestAddess = ({ formData, setFormData, error, setError, handleSubmit }) => {

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
    <form onSubmit={handleSubmit} className="checkout__form">


      <div className="row review-form">
        <div className="col-lg-12">
          <div className="checkout__form__input width-100">
            <p>Name <span>*</span></p>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
          </div>
        </div>
        <div className="col-lg-12">
          <div className="checkout__form__input width-100">
            <p>Address<span>*</span></p>
            <input type="text" name="line1" value={formData.line1} onChange={handleChange} className="form-control" />
          </div>
        </div>
        <div className="col-lg-12">

          <div className="checkout__form__input width-100">
            <p>Landmark</p>
            <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="form-control" />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="checkout__form__input width-100">
            <p>Pin <span>*</span></p>
            <input type="text" name="pin" value={formData.pin} onChange={handleChange} onBlur={fillpindetails} className="form-control" />
          </div>
        </div>
        <div className="col-lg-6">

          <div className="checkout__form__input width-100">
            <p>City <span>*</span></p>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" disabled />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="checkout__form__input width-100">
            <p>State <span>*</span></p>
            <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" disabled />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="checkout__form__input width-100">
            <p>Country <span>*</span></p>
            <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-control" disabled />
          </div>
        </div>
        <div className="col-lg-6">

          <div className="checkout__form__input width-100">
            <p>Contact <span>*</span></p>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="form-control" />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="checkout__form__input width-100">
            <p>Alternate Contact</p>
            <input type="text" name="alternatecontact" value={formData.alternatecontact} onChange={handleChange} className="form-control " />
          </div>

        </div>
      </div>

      {
        error &&
        <div class="alert alert-danger my-4  text-custom-font-1" role="alert">
          {error}
        </div>
      }
    </form>
  )
}

export default GuestAddess
