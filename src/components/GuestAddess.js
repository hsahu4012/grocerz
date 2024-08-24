import React ,{useState} from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

const GuestAddess = ({setAddressFlag}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const [error, setError] = useState('')

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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}users/addguestuser`, {...formData});
      // setFormData({
      //   name: "",
      //   line1: "",
      //   line2: "",
      //   line3: "",
      //   city: "",
      //   state: "",
      //   country: "",
      //   pin: "",
      //   contact: "",
      //   alternatecontact: "",
      //   landmark: "",
      // });
      console.log(response)
      console.log(response.data.userid)
      console.log(response.data.addressid)
      const uid = response.data.userid;
      const aid = response.data.addressid;
      localStorage.setItem("userid",uid)
      localStorage.setItem('usertype',"user");
      // AddProductsToCart()
      // localStorage.setItem('cart',"");
      setAddressFlag(true)
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const AddProductsToCart = async () => {
    setLoading(true);
    try {
      const userid = localStorage.getItem('userid');
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const cartItems = storedCart.map(item => ({
        productid: item.productid,
        quantity: item.quantity
    }));
    for (let i = 0; i < cartItems.length; i++) {
      const { productid, quantity } = cartItems[i];
      const response = await axios.post(`${process.env.REACT_APP_API_URL}cart/addToCart`, {
          userid,
          productid,
          quantity
      })};
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    setLoading(false);
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
                                          
                                          <div className="row">
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
                                      <button type="submit" class="shop-btn mt-3" disabled={error}>Add Details and Order</button>
                                    </form>
                                  </div>
                                </div>
  )
}

export default GuestAddess
