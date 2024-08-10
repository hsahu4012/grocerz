import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import qr from '../assets/images/hashedbitqr.jpg';
import axios from "axios";

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentMode, setPaymentMode] = useState("Cash on Delivery"); // State for payment mode
    const userId = localStorage.getItem('userid'); // Assuming userId is stored in localStorage
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch cart items and addresses on component mount
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}cart/userCart/${userId}`);
                const items = response.data;
                setCartItems(items);
                const total = items.reduce((acc, item) => acc + ((Number(item.price) * item.quantity) - Number(item.discount)), 0);
                setTotalAmount(total);
            } catch (error) {
                console.error("Error fetching cart items", error);
            }
        };

        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}address/getByuserId/${userId}`);
                setAddresses(response.data);
                if (response.data.length > 0) {
                    setSelectedAddressId(response.data[0].addressid);
                }
            } catch (error) {
                console.error("Error fetching addresses", error);
            }
        };

        fetchCartItems();
        fetchAddresses();
    }, [userId]);

    const placeOrder = async () => {
        console.log('Order start...');

        try {
            // Prepare data for checkout
            const cartData = cartItems.map(item => ({
                productid: item.productid,
                quantity: item.quantity,
                price_final: (Number(item.price) * item.quantity) - Number(item.discount)
            }));

            const orderData = {
                cartData,
                userid: userId,
                addressId: selectedAddressId,
                paymentMode: paymentMode,
            };

            // Make API call to place the order
            const orderResponse = await axios.post(`${process.env.REACT_APP_API_URL}checkout/checkout`, orderData);

            if (orderResponse.data.status === 'success') {
                console.log('Order placed successfully.');
                navigate('/ordersuccess', { state: { orderId: orderResponse.data.orderid } });
            } else {
                console.error("Error placing order", orderResponse.data.message);
            }
        } catch (error) {
            console.error("Error placing order", error);
        }
    };

    const modalAction = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <section className="blog about-blog">
                <div className="container">
                    <div className="blog-heading about-heading">
                        <h1 className="heading">Checkout</h1>
                    </div>
                </div>
            </section>

            <section className="checkout product footer-padding">
                <div className="container">
                    <div className="checkout-section">
                        <div className="row gy-5 gy-lg-0">
                            <div className="col-lg-6">
                                <div className="checkout-wrapper">
                                    <div className="account-section billing-section box-shadows">
                                        <div className="profile-section address-section addresses">
                                            <div className="row gy-md-0 g-5">
                                                {addresses.map((address) => (
                                                    <div
                                                        key={address.addressid}
                                                        onClick={() => setSelectedAddressId(address.addressid)}
                                                        style={{
                                                            padding: '10px',
                                                            border: '1px solid #ddd',
                                                            marginBottom: '10px',
                                                            cursor: 'pointer',
                                                            backgroundColor: address.addressid === selectedAddressId ? '#f0f8ff' : 'white'
                                                        }}
                                                    >
                                                        <h5>{address.name}</h5>
                                                        <p>{address.street}, {address.line1}, {address.line2}, {address.line3}, {address.city}, {address.pin}, {address.country}, {address.contact}, {address.alternatecontact}, {address.landmark}</p>
                                                    </div>
                                                ))}
                                                <div className="col-lg-6">
                                                    {/* <a href="#" className="shop-btn" onClick={modalAction}>Open in Modal - Add New Address</a> */}
                                                    <Link to="/addressnew" className="shop-btn">Add New Address</Link>

                                                    <div className={`modal-wrapper submit ${isModalOpen ? 'open' : ''}`}>
                                                        <div className="anywhere-away" onClick={modalAction}></div>
                                                        <div className="login-section account-section modal-main">
                                                            <div className="review-form">
                                                                <div className="review-content">
                                                                    <h5 className="comment-title">Add Your Address</h5>
                                                                    <div className="close-btn">
                                                                        <img src="assets/images/homepage-one/close-btn.png" onClick={modalAction} alt="close-btn" />
                                                                    </div>
                                                                </div>
                                                                <div className="account-inner-form">
                                                                    <div className="review-form-name">
                                                                        <label htmlFor="firstname" className="form-label">First Name*</label>
                                                                        <input type="text" id="firstname" className="form-control" placeholder="First Name" />
                                                                    </div>
                                                                    <div className="review-form-name">
                                                                        <label htmlFor="lastname" className="form-label">Last Name*</label>
                                                                        <input type="text" id="lastname" className="form-control" placeholder="Last Name" />
                                                                    </div>
                                                                </div>
                                                                <div className="account-inner-form">
                                                                    <div className="review-form-name">
                                                                        <label htmlFor="useremail" className="form-label">Email*</label>
                                                                        <input type="email" id="useremail" className="form-control" placeholder="user@gmail.com" />
                                                                    </div>
                                                                    <div className="review-form-name">
                                                                        <label htmlFor="userphone" className="form-label">Phone*</label>
                                                                        <input type="tel" id="userphone" className="form-control" placeholder="+880388**0899" />
                                                                    </div>
                                                                </div>
                                                                <div className="review-form-name address-form">
                                                                    <label htmlFor="useraddress" className="form-label">Address*</label>
                                                                    <input type="text" id="useraddress" className="form-control" placeholder="Enter your Address" />
                                                                </div>
                                                                <div className="account-inner-form city-inner-form">
                                                                    <div className="review-form-name">
                                                                        <label htmlFor="usercity" className="form-label">Town / City*</label>
                                                                        <select id="usercity" className="form-select">
                                                                            <option>Choose...</option>
                                                                            <option>New York</option>
                                                                            <option>Dhaka</option>
                                                                            <option selected>London</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="review-form-name">
                                                                        <label htmlFor="usernumber" className="form-label">Postcode / ZIP*</label>
                                                                        <input type="number" id="usernumber" className="form-control" placeholder="0000" />
                                                                    </div>
                                                                </div>
                                                                <div className="login-btn text-center">
                                                                    <a href="#" onClick={modalAction} className="shop-btn">Add Address</a>
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
                            <div className="col-lg-6">
                                <div className="checkout-wrapper">
                                    <div className="account-section billing-section box-shadows">
                                        <h5 className="wrapper-heading">Order Summary</h5>
                                        <div className="order-summery">
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
                                            <div className="subtotal product-total">
                                                <h5 class="wrapper-heading">Total Amount</h5>
                                                <h5 class="wrapper-heading">&#8377;{totalAmount}</h5>
                                            </div>
                                            <div className="subtotal product-total">
                                                <h5 class="wrapper-heading">Delivery Charges</h5>
                                                <h5 class="wrapper-heading">&#8377; 0</h5>
                                            </div>
                                            <div className="subtotal product-total">
                                                <h5 class="wrapper-heading">Packaging Charges</h5>
                                                <h5 class="wrapper-heading">&#8377; 0</h5>
                                            </div>
                                            <div className="subtotal product-total">
                                                <h5 class="wrapper-heading">Platform Fee</h5>
                                                <h5 class="wrapper-heading">&#8377; 0</h5>
                                            </div>

                                            <div class="subtotal total"><h5 class="wrapper-heading">TOTAL</h5>
                                            <h5 class="wrapper-heading price">&#8377;{totalAmount}</h5></div>
                                            <h5>Payment Mode</h5>


                                            <div class="subtotal payment-type">
                                                <div>UPI ID - 9599171535@upi</div>
                                                <div>QR - <img src="/static/media/hashedbitqr.6cccddbb20d59af97044.jpg" alt="qr" style={{width: '200px'}} /></div>
                                                {/* <div class="checkbox-item">
                                                    <input type="radio" id="cash" name="bank" />
                                                    <div class="cash">
                                                        <h5 class="wrapper-heading">Cash on Delivery</h5>
                                                    </div>
                                                </div>
                                                <div class="checkbox-item"><input type="radio" id="credit" name="bank" />
                                                    <div class="credit">
                                                        <h5 class="wrapper-heading">UPI - 9599171535@upi</h5>
                                                    </div>
                                                </div>
                                                <div class="checkbox-item"><input type="radio" id="credit" name="bank" />
                                                    <div class="credit">
                                                        <h5 class="wrapper-heading">QR - <img src="/static/media/hashedbitqr.6cccddbb20d59af97044.jpg" alt="qr" style={{width: '200px'}} /></h5>
                                                    </div>
                                                </div> */}
                                            </div>

                                            <div className="payment-mode">
                                                <h5 className="wrapper-heading">Select Payment Mode:</h5>
                                                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="form-select">
                                                    <option value="cod">Cash on Delivery</option>
                                                    <option value="upi">UPI</option>
                                                    <option value="qr">QR</option>
                                                </select>
                                            </div>
                                            <div className="checkout-footer mt-4">
                                                <button className="shop-btn d-block" onClick={placeOrder}>Place Order</button>
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
        </>
    );
}

export default Checkout;
