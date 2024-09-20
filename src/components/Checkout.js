import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import qr from '../assets/images/hashedbitqr.jpg';
import axios from 'axios';
import GuestAddess from './GuestAddess';
import Loader from './loader/Loader';
import loaderGif from '../assets/images/loader.gif';

function Checkout() {
  // Setting up single button to place order
  const [formData, setFormData] = useState({
    name: '',
    line1: '',
    line2: '',
    line3: '',
    city: '',
    state: '',
    country: '',
    pin: '',
    contact: '',
    alternatecontact: '',
    landmark: '',
  });
  const [error, setError] = useState('');
  const handleSubmit = async () => {
    // Check if mandatory fields are empty
    if (
      formData.name.trim() === '' ||
      formData.line1.trim() === '' ||
      formData.city.trim() === '' ||
      formData.state.trim() === '' ||
      formData.country.trim() === '' ||
      formData.pin.trim() === '' ||
      formData.contact.trim() === ''
    ) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    // Check if pin code is a number
    if (isNaN(formData.pin.trim())) {
      alert('Pin code must be a number.');
      return;
    }

    // Check if contact numbers are 10 digits
    if (
      !/^\d{10}$/.test(formData.contact.trim())
      //!/^\d{10}$/.test(formData.alternatecontact.trim())
    ) {
      alert('Contact numbers must be 10-digit numbers.');
      return;
    }

    try {
      const userId = localStorage.getItem('userid') || '';
      if (userId) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}address/addAddress`,
          { userid: userId, ...formData }
        );
        setFormData({
          name: '',
          line1: '',
          line2: '',
          line3: '',
          city: '',
          state: '',
          country: '',
          pin: '',
          contact: '',
          alternatecontact: '',
          landmark: '',
        });
        const uid = response.data.userid;
        const aid = response.data.addressid;
        const obj = { aid: aid, uid: uid };
        return obj;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}users/addguestuser`,
        { ...formData }
      );
      setFormData({
        name: '',
        line1: '',
        line2: '',
        line3: '',
        city: '',
        state: '',
        country: '',
        pin: '',
        contact: '',
        alternatecontact: '',
        landmark: '',
      });
      // console.log(response)
      // console.log(response.data.userid)
      // console.log(response.data.addressid)
      const uid = response.data.userid;
      const aid = response.data.addressid;
      const obj = { aid: aid, uid: uid };
      return obj;
    } catch (error) {
      console.error('API error:', error);
      return {};
    }
  };
  // to here
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState('DUE - COD/QR/UPI'); // State for payment mode
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const userId = localStorage.getItem('userid') || '';
  // console.log("userID",userId)
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [checkoutstatus, setCheckoutStatus] = useState(false);
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userid') || '';
      if (userId) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}cart/userCart/${userId}`
        );
        const items = response.data;
        console.log('Itemsi', items);
        setCartItems(items);
      } else {
        const storedCartItems = localStorage.getItem('cart').length
          ? JSON.parse(localStorage.getItem('cart'))
          : [];
        setCartItems([...storedCartItems]);
      }
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
    setLoading(false);
  };

  const calculateTotal = () => {
    if (cartItems.length > 0) {
      let total = cartItems.reduce(
        (total, item) =>
          total +
          (Number(item.price) * item.quantity -
            Number(item.discount) * item.quantity),
        0
      );
      // console.log("Total Calculated:", total);
      setTotalAmount(total);
    } else {
      setTotalAmount(0);
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const fetchAddresses = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}address/getByuserId/${userId}`
        );
        setAddresses(response.data);
        if (response.data.length > 0) {
          setSelectedAddressId(response.data[0].addressid);
        }
      } catch (error) {
        console.error('Error fetching addresses', error);
      }
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchAddresses();
  }, []);

  const placeOrder = async () => {
    setIsPlacingOrder(true);
    let userData = {};
    let orderData = {};
    const cartData = cartItems.map(item => ({
      productid: item.productid,
      quantity: item.quantity,
      price_final:
        Number(item.price) * item.quantity -
        Number(item.discount) * item.quantity,
    }));
    try {
      if (userId) {
        orderData = {
          cartData,
          userid: userId,
          addressId: selectedAddressId,
          paymentMode: paymentMode,
        };
      } else {
        userData = await handleSubmit();
        orderData = {
          cartData,
          userid: userData.uid,
          addressId: userData.aid,
          paymentMode: paymentMode,
        };
      }
      // Prepare data for checkout

      // Make API call to place the order
      const orderResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}checkout/checkout`,
        orderData
      );
      if (orderResponse.data.status === 'success') {
        // console.log('Order placed successfully.');
        const soldProductData = cartData.map(item => ({
          productid: item.productid,
          quantity: item.quantity,
        }));
        const soldProductCount = await axios.post(
          `${process.env.REACT_APP_API_URL}orders/soldproductcount`,
          soldProductData
        );
        // console.log("soldProductCount,",soldProductCount)
        setLoader(false);
        localStorage.removeItem('cart');
        navigate('/orderhistory', {
          state: { orderId: orderResponse.data.orderid },
        });
      }
    } catch (error) {
      setLoader(false);
      console.error('Error placing order', error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const modalAction = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fillpindetails = () => {
    if (formData.pin === '848210') {
      setError('');
      setFormData(prevState => ({
        ...prevState,
        city: 'Rosera',
        state: 'Bihar',
        country: 'India',
      }));
    } else {
      setError('Sorry! We do not serve in this area.');
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          {/* {loading && <Loader />}
                    <div className="blog-heading about-heading">
                        <h1 className="heading">Checkout</h1>
                        <img src={loaderGif} alt="Loading..." style={{ width: '80px', height: '80px' }} />
                    </div> */}
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
        </div>
      </section>

      <section className='checkout product footer-padding'>
        <div className='container'>
          <div className='checkout-section'>
            <div className='row gy-5 gy-lg-0'>
              <div className='col-lg-6'>
                <div className='checkout-wrapper'>
                  <div className='account-section billing-section box-shadows'>
                    <h5 className='wrapper-heading'>
                      {userId
                        ? 'Select Delivery Address'
                        : 'Add Details To Order'}
                    </h5>
                    <div className='profile-section address-section addresses'>
                      <div className=''>
                        {userId ? (
                          <>
                            {addresses.map((address, index) => (
                              <div
                                key={address.addressid}
                                onClick={() =>
                                  setSelectedAddressId(address.addressid)
                                }
                                className='seller-info'
                                style={{
                                  backgroundColor:
                                    address.addressid === selectedAddressId
                                      ? 'rgba(52, 168, 83, 0.2)'
                                      : 'white',
                                }}
                              >
                                <h4 className='heading-custom-font-1'>
                                  Address - {index + 1}
                                </h4>
                                <p>Name - {address.name}</p>
                                <p>Address - {address.line1}</p>
                                <p>
                                  City - {address.city}, {address.state},{' '}
                                  {address.country}, {address.pin},
                                </p>
                                <p>Landmark - {address.landmark}</p>
                                <p>
                                  Contact - {address.contact}&nbsp;&nbsp;{' '}
                                  {address.alternatecontact}
                                </p>
                              </div>
                            ))}
                            {addresses.length === 0 && (
                              <div
                                class='alert alert-danger my-4 text-custom-font-1'
                                role='alert'
                              >
                                Please, add an address to proceed.
                              </div>
                            )}
                            <button
                              type='button'
                              className='shop-btn'
                              onClick={modalAction}
                            >
                              Add New Address
                            </button>
                          </>
                        ) : (
                          <>
                            <GuestAddess
                              setFormData={setFormData}
                              setError={setError}
                              formData={formData}
                              error={error}
                            />
                          </>
                        )}
                        <form onSubmit={handleSubmit}>
                          {/* <a href="#" className="shop-btn" onClick={modalAction}>Open in Modal - Add New Address</a> */}
                          {/* <Link to="/addressnew" className="shop-btn">Add New Address</Link> */}

                          <div
                            className='modal-wrapper'
                            style={{
                              display: isModalOpen ? 'block' : 'none',
                              marginLeft: '33vw',
                              marginTop: '10vh',
                            }}
                          >
                            <div
                              className='anywhere-away'
                              onClick={modalAction}
                            ></div>
                            <div className='login-section account-section modal-main col-4'>
                              <div className='review-form'>
                                <div
                                  className='review-content'
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: '6em',
                                  }}
                                >
                                  <h5
                                    className='comment-title'
                                    style={{
                                      marginTop: '1.67em',
                                      marginBottom: '1.67em',
                                    }}
                                  >
                                    Add Your Address
                                  </h5>
                                  <div className='close-btn'>
                                    <img
                                      src='assets/images/homepage-one/close-btn.png'
                                      onClick={modalAction}
                                      alt='close-btn'
                                    />
                                  </div>
                                </div>
                                <div className='account-inner-form'>
                                  <div className='review-form-name'>
                                    <label
                                      htmlFor='name'
                                      className='form-label'
                                    >
                                      Name*
                                    </label>
                                    <input
                                      type='text'
                                      id='name'
                                      className='form-control'
                                      name='name'
                                      placeholder='Name'
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                                <div className='account-inner-form'>
                                  <div className='review-form-name'>
                                    <label
                                      htmlFor='userphone'
                                      className='form-label'
                                    >
                                      Contact*
                                    </label>
                                    <input
                                      type='tel'
                                      id='userphone'
                                      className='form-control'
                                      name='contact'
                                      placeholder='Contact'
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div className='review-form-name'>
                                    <label
                                      htmlFor='alternatephone'
                                      className='form-label'
                                    >
                                      Alternate Contact
                                    </label>
                                    <input
                                      type='tel'
                                      id='alternatephone'
                                      className='form-control'
                                      name='alternatecontact'
                                      placeholder='Alternate Contact'
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                                <div className='account-inner-form'>
                                  <div className='review-form-name'>
                                    <label
                                      htmlFor='useraddress'
                                      className='form-label'
                                    >
                                      Address*
                                    </label>
                                    <input
                                      type='text'
                                      id='useraddress'
                                      className='form-control'
                                      name='line1'
                                      placeholder='Enter your Address'
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                                <div className='account-inner-form'>
                                  <div className='review-form-name'>
                                    <label
                                      htmlFor='landmark'
                                      className='form-label'
                                    >
                                      Landmark
                                    </label>
                                    <input
                                      type='text'
                                      id='landmark'
                                      className='form-control'
                                      name='landmark'
                                      placeholder='Landmark'
                                      onChange={handleChange}
                                    />
                                  </div>
                                  <div className='review-form-name'>
                                    <label htmlFor='zip' className='form-label'>
                                      Pin*
                                    </label>
                                    <input
                                      type='number'
                                      id='zip'
                                      className='form-control'
                                      name='pin'
                                      placeholder='Pin'
                                      onChange={handleChange}
                                      onBlur={fillpindetails}
                                    />
                                  </div>
                                </div>
                                <div className='account-inner-form'>
                                  <div className='review-form-name'>
                                    <label
                                      htmlFor='city'
                                      className='form-label'
                                    >
                                      City*
                                    </label>
                                    <input
                                      type='text'
                                      id='city'
                                      value={formData.city}
                                      className='form-control'
                                      name='city'
                                      placeholder='City'
                                      onChange={handleChange}
                                      disabled
                                    />
                                  </div>

                                  <div className='review-form-name'>
                                    <label
                                      htmlFor='state'
                                      className='form-label'
                                    >
                                      State*
                                    </label>
                                    <input
                                      type='text'
                                      id='state'
                                      value={formData.state}
                                      className='form-control'
                                      name='state'
                                      placeholder='State'
                                      onChange={handleChange}
                                      disabled
                                    />
                                  </div>

                                  <div className='review-form-name'>
                                    <label
                                      htmlFor='country'
                                      className='form-label'
                                    >
                                      Country*
                                    </label>
                                    <input
                                      type='text'
                                      id='country'
                                      value={formData.country}
                                      className='form-control'
                                      name='country'
                                      placeholder='Country'
                                      onChange={handleChange}
                                      disabled
                                    />
                                  </div>
                                </div>
                                <div className='login-btn text-center'>
                                  <button
                                    type='submit'
                                    onClick={modalAction}
                                    className='shop-btn'
                                  >
                                    Add Address
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-6'>
                <div className='checkout-wrapper'>
                  <div className='account-section billing-section box-shadows'>
                    <h5 className='wrapper-heading'>Order Summary</h5>
                    <div className='order-summery'>
                      {/* <div className="subtotal product-total">
                                                <ul className="product-list">
                                                    {cartItems.map((item) => {
                                                        const itemTotal = (Number(item.price) * item.quantity) - Number(item.discount);

                                                        return (
                                                            <li key={item.productid}>
                                                                <div className="product-info">
                                                                    <h5 className="wrapper-heading">Product Name: {item.prod_name}</h5>
                                                                    <h5 className="wrapper-heading">Quantity: {item.quantity}</h5>
                                                                    <p className="paragraph">Discount: {item.discount}</p>
                                                                    <h6 className="price">Total Price: ₹{itemTotal}</h6>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div> */}
                      <div className='subtotal product-total'>
                        <h5 class='wrapper-heading'>Total Amount</h5>
                        <h5 class='wrapper-heading'>&#8377;{totalAmount}</h5>
                      </div>
                      <div className='subtotal product-total'>
                        <h5 class='wrapper-heading'>Delivery Charges</h5>
                        <h5 class='wrapper-heading'>&#8377; 0</h5>
                      </div>
                      {/* <div className="subtotal product-total">
                                                <h5 class="wrapper-heading">Packaging Charges</h5>
                                                <h5 class="wrapper-heading">&#8377; 0</h5>
                                            </div>
                                            <div className="subtotal product-total">
                                                <h5 class="wrapper-heading">Platform Fee</h5>
                                                <h5 class="wrapper-heading">&#8377; 0</h5>
                                            </div> */}

                      <div class='subtotal total'>
                        <h5 class='wrapper-heading'>Total</h5>
                        <h5 class='wrapper-heading price'>
                          &#8377;{totalAmount}
                        </h5>
                      </div>
                      <h5 className='heading-custom-font-1'>
                        Payment Mode - Cash on Delivery / UPI / QR
                      </h5>

                      {/* <div class="subtotal payment-type">
                                                <div>UPI ID - 9599171535@upi</div>
                                                <div>QR - <img src="/static/media/hashedbitqr.6cccddbb20d59af97044.jpg" alt="qr" style={{ width: '200px' }} /></div>
                                                
                                            </div> */}

                      {/* <div className="payment-mode my-2">
                                                <h5 className="wrapper-heading">Select Payment Mode:</h5>
                                                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="form-select">
                                                    <option value="DUE - COD/QR/UPI">Due - Cash on Delivery / UPI / QR</option>
                                                </select>
                                            </div> */}
                      {totalAmount < 100 && (
                        <div
                          class='alert alert-danger my-4 text-custom-font-1'
                          role='alert'
                        >
                          Minimum Cart Value should be 100.
                        </div>
                      )}
                      <div className='checkout-footer mt-5'>
                        <button
                          className='shop-btn d-block'
                          onClick={placeOrder}
                          disabled={totalAmount < 100}
                        >
                          {isPlacingOrder
                            ? 'Placing Your Order...'
                            : 'Place Order'}
                        </button>
                      </div>
                      {/* <div className="payment-method">
                                                <img src={qr} alt="QR Payment" style={{ height: '200px' }} />
                                            </div> */}
                    </div>
                  </div>
                  {/* <div className="col-lg-6">
                                        <Link to="/cart" className="shop-btn">Back to Cart</Link>
                                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loader && (
        <div className='loader-overlay'>
          <img src={loaderGif} alt='Loading...' className='loader-green' />
        </div>
      )}
    </>
  );
}

export default Checkout;
