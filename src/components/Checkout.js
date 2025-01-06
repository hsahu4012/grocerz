import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import qr from '../assets/images/hashedbitqr.jpg';
import axios from 'axios';
import GuestAddess from './GuestAddess';
// import Loader from './loader/Loader';
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
        // console.log('Itemsi', items);
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
      original_mrp: Number(item.price) * item.quantity,
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
          totalDiscount: Math.ceil(discountAmount)
        };
      } else {
        userData = await handleSubmit();
        orderData = {
          cartData,
          userid: userData.uid,
          addressId: userData.aid,
          paymentMode: paymentMode,
          totalDiscount: 0
        };
      }
      // Prepare data for checkout

      // Make API call to place the order
      const orderResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}checkout/checkout`,
        orderData
      );
      if (orderResponse.data.status === 'success') {
        const orderId = orderResponse.data.orderid;
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
        // navigate(`/orderplaced/${orderId}`);
        navigate("/quickfeedback") 
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

  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [MaxdiscountAmount, setMaxDiscountAmount] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountMsg, setDiscountMsg] = useState(false)

  const verifyCouponCode = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}discount/discountbycc/${couponCode}`);
      if (response.data.length > 0) {
        const discountPercentage = response.data[0].percentage;
        const fixedDiscount = response.data[0].amount;
        const maxDiscountAmount = response.data[0].maxdiscount;
        setDiscountPercentage(discountPercentage)
        setMaxDiscountAmount(maxDiscountAmount)
        calculateTotalDiscount(maxDiscountAmount, discountPercentage, fixedDiscount);
        setIsCouponApplied(true);
        setDiscountMsg(false)

      } else {
        setDiscountPercentage(0)
        setIsCouponApplied(false);
        setDiscountAmount(0)
      }
    } catch (error) {
      console.error('Error fetching addresses', error);
      setIsCouponApplied(false);
    }
  }

  const calculateTotalDiscount = (DisAmount = 99999, DisPercentage, DiscAmount) => {
    let finalDiscount = 0;
    if (DiscAmount > 0) {
      finalDiscount = DiscAmount;
    }
    else {
      const discount = (DisPercentage / 100) * totalAmount;
      finalDiscount = Math.min(discount, DisAmount);
    }
    setDiscountAmount(finalDiscount)
  }


  const orderCount = async () => {
    try {
      const userId = localStorage.getItem('userid') || '';
      console.log('userid in side ordercount', userId)
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getOrderCountByUserId/${userId}`
      );
      if (data) {
        const totalOrders = data.totalOrders
        if (totalOrders === 0) {
          setDiscountPercentage(5)
          setMaxDiscountAmount(500);
          console.log('totalAmount', totalAmount)
          const discount = Number((5 / 100) * totalAmount);
          // const finalDiscount = Number(Math.min(discount, discountAmount));
          console.log('discount', discount)
          setDiscountAmount(discount)
          setIsCouponApplied(true);
          setDiscountMsg(true)
        }
      }
    } catch (error) {
      console.error('Error fetching addresses', error);
      setIsCouponApplied(false);
    }
  }
  useEffect(() => {
    console.log('checking order count...')
    //orderCount();
  }, [totalAmount])


  useEffect(() => {
    console.log('discount amount - ', discountAmount)
  }, [discountAmount])

  return (
    <>

      <section className='blog about-blog'>
        <div className='container'>
          {/* {loading && <Loader />} */}
          <div className="blog-heading about-heading">
            <h1 className="heading">Checkout</h1>
            {/* <img src={loaderGif} alt="Loading..." style={{ width: '80px', height: '80px' }} /> */}
          </div>
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
                      <div
                        className={`modal fade ${isModalOpen ? 'show d-block' : 'd-none'}`}
                        tabIndex="-1"
                        role="dialog"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                      >
                        <div className="modal-dialog modal-dialog-centered" role="document">
                          <div className="modal-content">
                          <div className="d-flex justify-content-between align-items-center">
                             <h5 className="m-0 ms-3">Add Your Address</h5>
                             <img src='assets/images/homepage-one/close-btn.png' onClick={modalAction} alt="close-btn" className="me-3 mt-2 cursor-pointer img-hover" />
                          </div>
                            <div className="modal-body">
                              <div className="mb-3">
                                <label htmlFor="name" className="form-label fs-4">
                                  Name*
                                </label>
                                <input
                                  type="text"
                                  id="name"
                                  className="form-control fs-4"
                                  name="name"
                                  placeholder="Name"
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="userphone" className="form-label fs-4">
                                  Contact*
                                </label>
                                <input
                                  type="tel"
                                  id="userphone"
                                  className="form-control fs-4"
                                  name="contact"
                                  placeholder="Contact"
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="useraddress" className="form-label fs-4">
                                  Address*
                                </label>
                                <input
                                  type="text"
                                  id="useraddress"
                                  className="form-control fs-4"
                                  name="line1"
                                  placeholder="Enter your Address"
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="row">
                                <div className="col-md-6 mb-3 fs-4">
                                  <label htmlFor="landmark" className="form-label fs-4">
                                    Landmark
                                  </label>
                                  <input
                                    type="text"
                                    id="landmark"
                                    className="form-control fs-4"
                                    name="landmark"
                                    placeholder="Landmark"
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="zip" className="form-label fs-4">
                                    Pin*
                                  </label>
                                  <input
                                    type="number"
                                    id="zip"
                                    className="form-control fs-4"
                                    name="pin"
                                    placeholder="Pin"
                                    onChange={handleChange}
                                    onBlur={fillpindetails}
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="city" className="form-label fs-4">
                                    City*
                                  </label>
                                  <input
                                    type="text"
                                    id="city"
                                    value={formData.city}
                                    className="form-control fs-4"
                                    name="city"
                                    placeholder="City"
                                    onChange={handleChange}
                                    disabled
                                  />
                                </div>
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="state" className="form-label fs-4">
                                    State*
                                  </label>
                                  <input
                                    type="text"
                                    id="state"
                                    value={formData.state}
                                    className="form-control fs-4"
                                    name="state"
                                    placeholder="State"
                                    onChange={handleChange}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button 
                                className="btn btn-danger btn-lg px-4 fs-3"
                                onClick={modalAction}
                              >
                                Close
                              </button>
                              <button  className="btn btn-primary btn-lg  px-4 fs-3">
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
                    {/* discount section  */}
                    {/* <div className="apply-coupon-section">
                      <h5 className="wrapper-heading">Apply Coupon</h5>
                      <div className="row mb-3 text-custom-font-1">
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <button
                            className={couponCode ? 'btn btn-success w-100' : 'btn btn-secondary w-100 disabled'}
                            type="button"
                            onClick={verifyCouponCode}
                          >
                            Verify Code
                          </button>
                        </div>
                        <div className="col-12">
                          {isCouponApplied && (
                            <div className="alert alert-success mt-2" role="alert">
                              {discountMsg ? <strong >1st Order Discount Applied Successfully</strong> : <strong>Coupon Applied Successfully!</strong>}
                              <span className="d-block">
                                You Got <strong>&#8377; {Math.ceil(discountAmount)}</strong> | Max Discount - <strong>&#8377; {MaxdiscountAmount}</strong>.
                              </span>
                            </div>
                          )}
                          {isCouponApplied === false && (
                            <div className="alert alert-danger mt-2" role="alert">
                              { }
                            </div>
                          )}
                        </div>
                      </div>
                    </div> */}

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
                      <div className='subtotal product-total'>
                        <h5 class='wrapper-heading'>Discount</h5>
                        <h5 class='wrapper-heading'>&#8377; {Math.ceil(discountAmount)}</h5>
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
                        <h5 class='wrapper-heading'>Payable Amount</h5>
                        <h5 class='wrapper-heading price'>
                          &#8377; {Math.floor(totalAmount - discountAmount)}
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
