import React from "react";
import { Link, useNavigate} from "react-router-dom";
import qr from '../assets/images/hashedbitqr.jpg';
import axios from "axios";

import AddressListDataCheckout from "./AddressListDataCheckout";


function Checkout() {

    const navigate = useNavigate();

    const placeorder = () => {
        console.log('order start.....')

        const placeorder = async () => {
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}cart/userCart`);
              //setCartItems(response.data);
              if(response.status === 200) {
                navigate('/ordersuccess')
              }
            } catch (error) {
              console.error("Error fetching cart items", error);
            }
          };

    }
    return (
        <>
            <section class="blog about-blog">
                <div class="container">
                    
                    <div class="blog-heading about-heading">
                        <h1 class="heading">Checkout</h1>
                    </div>
                </div>
            </section>


            <section class="checkout product footer-padding">
                <div class="container">
                    <div class="checkout-section">
                        <div class="row gy-5 gy-lg-0">
                            <div class="col-lg-6">
                                <div class="checkout-wrapper">
                                    <div class="account-section billing-section box-shadows">




                                        <div class="profile-section address-section addresses ">
                                            <div class="row gy-md-0 g-5">

                                                <AddressListDataCheckout />
                                                
                                                <div class="col-lg-6">
                                                    <a href="#" class="shop-btn">Add New Address - Open in modal</a>


                                                    <div class="modal-wrapper submit">
                                                        <div class="anywhere-away"></div>


                                                        <div class="login-section account-section modal-main">
                                                            <div class="review-form">
                                                                <div class="review-content">
                                                                    <h5 class="comment-title">Add Your Address</h5>
                                                                    <div class="close-btn">
                                                                        <img src="assets/images/homepage-one/close-btn.png"
                                                                            onclick="modalAction('.submit')" alt="close-btn" />
                                                                    </div>
                                                                </div>
                                                                <div class=" account-inner-form">
                                                                    <div class="review-form-name">
                                                                        <label for="firstname" class="form-label">First
                                                                            Name*</label>
                                                                        <input type="text" id="firstname" class="form-control"
                                                                            placeholder="First Name" />
                                                                    </div>
                                                                    <div class="review-form-name">
                                                                        <label for="lastname" class="form-label">Last Name*</label>
                                                                        <input type="text" id="lastname" class="form-control"
                                                                            placeholder="Last Name" />
                                                                    </div>
                                                                </div>
                                                                <div class=" account-inner-form">
                                                                    <div class="review-form-name">
                                                                        <label for="useremail" class="form-label">Email*</label>
                                                                        <input type="email" id="useremail" class="form-control"
                                                                            placeholder="user@gmail.com" />
                                                                    </div>
                                                                    <div class="review-form-name">
                                                                        <label for="userphone" class="form-label">Phone*</label>
                                                                        <input type="tel" id="userphone" class="form-control"
                                                                            placeholder="+880388**0899" />
                                                                    </div>
                                                                </div>
                                                                <div class="review-form-name address-form">
                                                                    <label for="useraddress" class="form-label">Address*</label>
                                                                    <input type="text" id="useraddress" class="form-control"
                                                                        placeholder="Enter your Address" />
                                                                </div>
                                                                <div class=" account-inner-form city-inner-form">
                                                                    <div class="review-form-name">
                                                                        <label for="usercity" class="form-label">Town /
                                                                            City*</label>
                                                                        <select id="usercity" class="form-select">
                                                                            <option>Choose...</option>
                                                                            <option>Newyork</option>
                                                                            <option>Dhaka</option>
                                                                            <option selected>London</option>
                                                                        </select>
                                                                    </div>
                                                                    <div class="review-form-name">
                                                                        <label for="usernumber" class="form-label">Postcode /
                                                                            ZIP*</label>
                                                                        <input type="number" id="usernumber" class="form-control"
                                                                            placeholder="0000" />
                                                                    </div>
                                                                </div>
                                                                <div class="login-btn text-center">
                                                                    <a href="#" onclick="modalAction('.submit')"
                                                                        class="shop-btn">Add Address</a>
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
                            <div class="col-lg-6">
                                <div class="checkout-wrapper">
                                    <div class="account-section billing-section box-shadows">
                                        <h5 class="wrapper-heading">Order Summary</h5>
                                        <div class="order-summery ">
                                            {/* <div class="subtotal product-total">
                                                <h5 class="wrapper-heading">PRODUCT</h5>
                                                <h5 class="wrapper-heading">TOTAL</h5>
                                            </div>
                                            <hr></hr>
                                            <div class="subtotal product-total">
                                                <ul class="product-list">
                                                    <li>
                                                        <div class="product-info">
                                                            <h5 class="wrapper-heading">Apple Watch X1</h5>
                                                            <p class="paragraph">64GB, Black, 44mm, Chain Belt</p>
                                                        </div>
                                                        <div class="price">
                                                            <h5 class="wrapper-heading">$38</h5>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="product-info">
                                                            <h5 class="wrapper-heading">Beats Wireless x1</h5>
                                                            <p class="paragraph">64GB, Black, 44mm, Chain Belt</p>
                                                        </div>
                                                        <div class="price">
                                                            <h5 class="wrapper-heading">$48</h5>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="product-info">
                                                            <h5 class="wrapper-heading">Samsung Galaxy S10 x2</h5>
                                                            <p class="paragraph">12GB RAM, 512GB, Dark Blue</p>
                                                        </div>
                                                        <div class="price">
                                                            <h5 class="wrapper-heading">$279</h5>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <hr></hr> */}
                                            <div class="subtotal product-total">
                                                <h5 class="wrapper-heading">Total MRP</h5>
                                                <h5 class="wrapper-heading">$365</h5>
                                            </div>
                                            <div class="subtotal product-total">
                                                <ul class="product-list">
                                                    <li>
                                                        <div class="product-info">
                                                            <p class="paragraph">Discount</p>
                                                            <h5 class="wrapper-heading">Delivery Charges</h5>
                                                            <h5 class="wrapper-heading">Packaging Charges</h5>
                                                            <h5 class="wrapper-heading">Platform Fee</h5>

                                                        </div>
                                                        <div class="price-checkout">
                                                            <h5 class="wrapper-heading">+$0</h5>
                                                            <h5 class="wrapper-heading">+$0</h5>
                                                            <h5 class="wrapper-heading">+$0</h5>
                                                            <h5 class="wrapper-heading">+$0</h5>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <hr></hr>
                                            <div class="subtotal total">
                                                <h5 class="wrapper-heading">TOTAL</h5>
                                                <h5 class="wrapper-heading price">$365</h5>
                                            </div>
                                            <h5>Payment Mode</h5>
                                            <div class="subtotal payment-type">
                                                {/* <div class="checkbox-item">
                                                    <input type="radio" id="bank" name="bank" />
                                                    <div class="bank">
                                                        <h5 class="wrapper-heading">Direct Bank Transfer</h5>
                                                        <p class="paragraph">Make your payment directly into our bank account.
                                                            Please use
                                                            <span class="inner-text">
                                                                your Order ID as the payment reference.
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div> */}
                                                <div class="checkbox-item">
                                                    <input type="radio" id="cash" name="bank" />
                                                    <div class="cash">
                                                        <h5 class="wrapper-heading">Cash on Delivery</h5>
                                                    </div>
                                                </div>
                                                <div class="checkbox-item">
                                                    <input type="radio" id="credit" name="bank" />
                                                    <div class="credit">
                                                        <h5 class="wrapper-heading">UPI - 9599171535@upi</h5>
                                                    </div>
                                                </div>
                                                <div class="checkbox-item">
                                                    <input type="radio" id="credit" name="bank" />
                                                    <div class="credit">
                                                        <h5 class="wrapper-heading">QR - <img src={qr} alt="qr" style={{width: '200px'}}/></h5>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <Link to="/paymentpage" class="shop-btn">Place Order Now</Link> */}
                                            <button onClick={placeorder} class="shop-btn">Place Order Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

export default Checkout;