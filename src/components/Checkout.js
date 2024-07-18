import React from "react";
import { Link } from "react-router-dom";

import AddressListDataCheckout from "./AddressListDataCheckout";


function Checkout() {
    return (
        <>

            <div class="breadcrumb-option">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="breadcrumb__links">
                                <Link to="index-2.html"><i class="fa fa-home"></i> Home</Link>
                                <span>Shopping cart</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section class="checkout spad">
                <div class="container">
                    {/* <div class="row">
                        <div class="col-lg-12">
                            <h6 class="coupon__link"><span class="icon_tag_alt"></span>
                                <Link to="#">Have a coupon?</Link> Click
                                here to enter your code.</h6>
                        </div>
                    </div> */}


                        <div class="row">
                            <div class="col-lg-8">
                                <h5>Billing detail</h5>
                                <AddressListDataCheckout />
                            </div>
                            <div class="col-lg-4">

                                <div class="discount__content">
                                    <h6>Discount codes</h6>
                                    <form action="#">
                                        <input type="text" placeholder="Enter your coupon code" />
                                        <button type="submit" class="site-btn">Apply</button>
                                    </form>
                                </div>

                                <div class="checkout__order">
                                    <h5>Your order</h5>

                                    <div class="checkout__order__total">
                                        <ul>
                                            <li>Total MRP <span>Rs. 123456</span></li>
                                            <li>Discount <span>Rs. 123456</span></li>
                                            <li>Delivery Charges <span>Rs. 123456</span></li>
                                            <li>Packaging Charges <span>Rs. 123456</span></li>
                                            <li>Total Payable<span>Rs. 123456</span></li>
                                        </ul>
                                    </div>
                                    {/* <div class="checkout__order__widget">
                                        <label for="o-acc">
                                            Create an acount?
                                            <input type="checkbox" id="o-acc" />
                                            <span class="checkmark"></span>
                                        </label>
                                        <p>Create am acount by entering the information below. If you are a returing customer
                                            login at the top of the page.</p>
                                        <label for="check-payment">
                                            Cheque payment
                                            <input type="checkbox" id="check-payment" />
                                            <span class="checkmark"></span>
                                        </label>
                                        <label for="paypal">
                                            PayPal
                                            <input type="checkbox" id="paypal" />
                                            <span class="checkmark"></span>
                                        </label>
                                    </div> */}
                                    <Link to="/paymentpage" ><button type="submit" class="site-btn">Place Order & Proceed to Payment</button></Link>
                                </div>
                            </div>
                        </div>
                </div>
            </section>
        </>
    )
}

export default Checkout;