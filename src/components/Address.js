import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DashboardRoutes from './DashboardRoutes';

const Address = () => {
  
  const userid = localStorage.getItem('userid');
  const [formData, setFormData] = useState({
    userid: userid,
    addressid: "",
    name: "",
    line1: "",
    line2: "",
    line3: "",
    city: "",
    state: "",
    country: "",
    pin: "",
    contact: "",
    alternatecontact: "",
    landmark: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if mandatory fields are empty
    if (
      formData.name.trim() === "" ||
      formData.line1.trim() === "" ||
      formData.city.trim() === "" ||
      formData.state.trim() === "" ||
      formData.country.trim() === "" ||
      formData.pin.trim() === "" ||
      formData.contact.trim() === ""

    ) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    // Check if pin code is a number
    if (isNaN(formData.pin.trim())) {
      alert("Pin code must be a number.");
      return;
    }

    // Check if contact numbers are 10 digits
    if (
      !/^\d{10}$/.test(formData.contact.trim())
      //!/^\d{10}$/.test(formData.alternatecontact.trim())
    ) {
      alert("Contact numbers must be 10-digit numbers.");
      return;
    }

    try {
      // Make POST request to the API endpoint
      const response = await axios.post(`${process.env.REACT_APP_API_URL}address/addAddress`, formData);
      console.log("API response:", response.data);
      // Clear the form data
      setFormData({
        userid: userid,
        addressid: "",
        name: "",
        line1: "",
        line2: "",
        line3: "",
        city: "",
        state: "",
        country: "",
        pin: "",
        contact: "",
        alternatecontact: "",
        landmark: "",
      });
      // Handle success, maybe redirect user or show a success message
    } catch (error) {
      console.error("API error:", error);
      // Handle error, maybe show an error message to the user
    }
  };


  return (
    <>

      <section className="blog about-blog">
        <div className="container">
          <div className="blog-bradcrum">
            <span><Link to="/">Home</Link></span>
            <span className="devider">/</span>
            <span><Link to="/dashboard">Dashboard</Link></span>
          </div>
          <div className="blog-heading about-heading">
            <h1 className="heading">User Dashboard</h1>
          </div>
        </div>
      </section>




      <section className="user-profile footer-padding">
        <div className="container">
          <div className="user-profile-section box-shadows">

            <div className="user-dashboard">
              <DashboardRoutes />

              <div
                className="tab-content nav-content"
                id="v-pills-tabContent"
                style={{ flex: "1 0%" }}
              >
                <div
                  className="tab-pane fade show active"
                  id="v-pills-home"
                  role="tabpanel"
                  aria-labelledby="v-pills-home-tab"
                  tabIndex={0}
                >
                  <div className="user-profile">

                    <div className="profile-section">
                      <div className="row g-5">
                        <div className="container">
                          <div className="row">
                            <div className="col-lg-12">

                              <div className="container">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <form onSubmit={handleSubmit} className="checkout__form">
                                      <div className="row">
                                        <div className="col-lg-12">
                                          <Link to="/address" class="shop-btn" >Back to Addresses</Link>
                                          <h5>Add New Address</h5>
                                          <div className="row">
                                            {/* <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="checkout__form__input">
                          <p>User ID <span>*</span></p>
                          <input type="text" name="userid" value={formData.userid} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="checkout__form__input">
                          <p>Address ID <span>*</span></p>
                          <input type="text" name="addressid" value={formData.addressid} onChange={handleChange} />
                        </div>
                      </div> */}
                                            <div className="col-lg-12">
                                              <div className="checkout__form__input">
                                                <p>Name <span>*</span></p>
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Address Line 1 <span>*</span></p>
                                                <input type="text" name="line1" value={formData.line1} onChange={handleChange} />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Address Line 2</p>
                                                <input type="text" name="line2" value={formData.line2} onChange={handleChange} />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Address Line 3</p>
                                                <input type="text" name="line3" value={formData.line3} onChange={handleChange} />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>City <span>*</span></p>
                                                <input type="text" name="city" value={formData.city} onChange={handleChange} />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>State <span>*</span></p>
                                                <input type="text" name="state" value={formData.state} onChange={handleChange} />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Country <span>*</span></p>
                                                <input type="text" name="country" value={formData.country} onChange={handleChange} />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Pin <span>*</span></p>
                                                <input type="text" name="pin" value={formData.pin} onChange={handleChange} />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Contact <span>*</span></p>
                                                <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Alternate Contact</p>
                                                <input type="text" name="alternatecontact" value={formData.alternatecontact} onChange={handleChange} />
                                              </div>
                                              <div className="checkout__form__input">
                                                <p>Landmark</p>
                                                <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <button type="submit" class="shop-btn">Add Address</button>
                                    </form>
                                  </div>
                                </div>
                              </div>


                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
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

export default Address;