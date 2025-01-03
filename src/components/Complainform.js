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
        
          <div class="blog-heading about-heading">
            <h1 class="heading">Feedback</h1>
          </div>
        </div>
        <div>
            <h6 class="heading1" align="center">feedback page ui same as complain page</h6>
        </div>
      </section>
    

<section class="contact product footer-padding spad pt-0 pb-0 ">
  <div class="container-fluid">
    <div class="contact-section">
      <div class="row p-0 m-0 justify-content-center">
        <div class="col-lg-12 p-0 m-0">
          <div class="question-section">
            <div class="review-form box-shadows">
              <div class="review-form-text">
                <h1 class="heading-custom-font-1">Get In Touch</h1>
              </div>
              <form onSubmit={handleSubmit}  >
                <div class="account-inner-form">
                  <div class="form-group form-control-custom">
                    <input name="name" type="text" id="fname" class="form-control mx-auto w-50"  placeholder="Name"
                      value={formData.name} onChange={handleChange} />
                  </div>
                        <div className="form-group">
                                {orderIds.length > 0 ? (
                                  <select
                                    name="orderid"
                                    className="form-control w-50 mx-auto"
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
                                    className="form-control w-50 mx-auto"
                                    placeholder="Enter your Order ID"
                                    value={formData.orderid}
                                    onChange={handleChange}
                                  />
                                 )}
                         </div>
                  <div class="form-group">
                    <input name="email" type="email" id="email" class="form-control w-50 mx-auto"
                      placeholder="Email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div class="form-group">
                    <input name="mobile" type="tel" id="mobile" class="form-control w-50 mx-auto" 
                      placeholder="Mobile" value={formData.mobile} onChange={handleChange} />
                  </div>
                  <div class="form-group">
                    <input name="address" type="text" id="address" class="form-control w-50 mx-auto" 
                      placeholder="Address" value={formData.address} onChange={handleChange} />
                  </div>

                  <div class="form-group">
                    <input name="subject" type="text" id="subject" class="form-control w-50 mx-auto" placeholder="Subject"
                      value={formData.subject} onChange={handleChange} />
                  </div>
                </div>
                <div class="form-group">
                  <textarea name="complain_desc" type="textarea" class="form-control w-50 mx-auto" placeholder="Write Your Feedback..........."
                    id="floatingTextarea" rows="3" value={formData.complain_desc} onChange={handleChange}>
                  </textarea>
                </div>
                <div className="text-center">
                <button type="submit" class="btn btn-primary btn-lg w-25 mt-3 p-4 mx-auto ">
                  Send Feedback
                </button>
                </div>
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