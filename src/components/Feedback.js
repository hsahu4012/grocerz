import React, { useState } from "react";
 // import "../assets/css/style.css";
import { Link } from "react-router-dom";
import axios from 'axios';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    subject: "",
    message: "",
    orderid: "",
    complain_desc: "",
  });
  const [orderIds, setOrderIds] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "name" && value !== "") {
      setLoading(true);
      setError(null);

      
      axios
        .get(`${process.env.REACT_APP_API_URL}orders/getOrderIdsByName/${value}`)
        .then((response) => {
          
          if (response.data && response.data.length > 0) {
            setOrderIds(response.data); // Set order IDs from API response
          } else {
            setOrderIds([]); 
          }
        })
        .catch((error) => {
          console.error("Error fetching order IDs:", error);
          setError("Error fetching order IDs. Please try again.");
          setOrderIds([]); 
        })
        .finally(() => {
          setLoading(false); 
        });
    }

  };
  // console.log(formData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}complains/addcomplain`,  formData );
      // console.log('Server response:', response.data);
      setFormData({
        name: "",
        email: "",
        mobile: "",
        address: "",
        subject: "",
        message: "",
        orderid: "",
        complain_desc: "",
      })
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const connectwhatsapp = () => {
    const phoneNumber = '+918757499345';
    const message = `Hi.`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank').focus();
  }

  return (
    <>

      <section class="blog about-blog">
        <div class="container">
           {/* <div class="blog-bradcrum">
                <span><a href="/">Home</a></span>
                <span class="devider">/</span>
                <span><a href="#">Contact</a></span>
            </div> */}
          <div class="blog-heading about-heading">
            <h1 class="heading">Feedback</h1>
          </div>
        </div>
      </section>

   {/* <div class="breadcrumb-option">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="breadcrumb__links">
                <Link href="/" className="text-decoration-none">
                  <i class="fa fa-home"></i> Home
                </Link>
                <span>Contact</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

 {/* <section className="contact spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="contact__content">
                <div className="contact__address">
                  <h5>Contact info</h5>
                  <ul>
                    <li>
                      <h6>
                        <i class="fa fa-map-marker"></i> Address
                      </h6>
                      <p>
                      Gurgaon, Haryana, India
                      </p>
                    </li>
                    <li>
                      <h6>
                        <i class="fa fa-phone"></i> Phone
                      </h6>
                      <p>
                        <span>+91 9669787936</span>
                        <span>+91 9599171535</span>
                      </p>
                    </li>
                    <li>
                      <h6>
                        <i class="fa fa-headphones"></i> Support
                      </h6>
                      <p>
                        <a
                          href="https://preview.colorlib.com/cdn-cgi/l/email-protection"
                          className="__cf_email__ text-decoration-none"
                          data-cfemail="44173134342b36306a342c2b302b233625342c3d042329252d286a272b29"
                        >
                          <p>hashedbit@gmail.com</p>
                        </a>
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="contact__form">
                  <h5>SEND MESSAGE</h5>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="mobile"
                      placeholder="Mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                    <textarea
                      name="message"
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                    <button type="submit" className="site-btn">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="contact__map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48158.305462977965!2d-74.13283844036356!3d41.02757295168286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2e440473470d7%3A0xcaf503ca2ee57958!2sSaddle%20River%2C%20NJ%2007458%2C%20USA!5e0!3m2!1sen!2sbd!4v1575917275626!5m2!1sen!2sbd"
                  height="780"
                  style={{ border: 0 }}
                  allowFullScreen
                  title="Google Map"
                ></iframe>
              </div> 
            </div>
          </div>
        </div>
      </section> */}
      
 <section class="contact product footer-padding spad pt-5 pb-0 ">
  <div class="container mb-5 ">
    <div class="contact-section">
      <div class="row p-0 m-0 justify-content-center">
        <div class="col-lg-12 p-0 m-0">
          <div class="question-section">
            <div class="review-form box-shadows shadow-lg p-4">
              <div class="review-form-text">
                <h1 class="heading-custom-font-1">Get In Touch</h1>
              </div>
              <form onSubmit={handleSubmit}  >
                <div class="account-inner-form">
                  <div class="mb-3">
                    <input name="name" type="text" id="fname" class="form-control "  placeholder="Name"
                      value={formData.name} onChange={handleChange} />
                  </div>
                        <div className="form-group">
                                {orderIds.length > 0 ? (
                                  <select
                                    name="orderid"
                                    className="form-control"
                                    value={formData.orderid}
                                    onChange={handleChange}
                                  >
                                   <option value="">Select Order ID</option>
                                    {loading ? (
                                      <option>Loading...</option>
                                    ) : error ? (
                                      <option>{error}</option>
                                    ) : (
                                      orderIds.map((order, index) => (
                                        <option key={index} value={order.order_id}>
                                          {order.order_id}
                                    </option>
                                      ))
                                    )}
                                  </select>
                                ) : (
                                  <input
                                    name="orderid"
                                    type="text"
                                    className="form-control "
                                    placeholder="Enter your Order ID"
                                    value={formData.orderid}
                                    onChange={handleChange}
                                  />
                                 )}
                         </div>
                  <div class="form-group">
                    <input name="email" type="email" id="email" class="form-control"
                      placeholder="Email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div class="form-group">
                    <input name="mobile" type="tel" id="mobile" class="form-control" 
                      placeholder="Mobile" value={formData.mobile} onChange={handleChange} />
                  </div>
                  <div class="form-group">
                    <input name="address" type="text" id="address" class="form-control " 
                      placeholder="Address" value={formData.address} onChange={handleChange} />
                  </div>

                  <div class="form-group">
                    <input name="subject" type="text" id="subject" class="form-control" placeholder="Subject"
                      value={formData.subject} onChange={handleChange} />
                  </div>
                </div>
                <div class="form-group">
                  <textarea name="complain_desc" type="textarea" class="form-control " placeholder="Write Your Feedback..........."
                    id="floatingTextarea" rows="3" value={formData.complain_desc} onChange={handleChange}>
                  </textarea>
                </div>
                  <button type="submit"   class='form-submit-buttonf'>
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

export default Feedback;