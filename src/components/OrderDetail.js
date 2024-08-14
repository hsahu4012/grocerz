import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardRoutes from './DashboardRoutes'; // Assuming you have this component

const OrderDetail = () => {
    const { orderid } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const navigate = useNavigate();
    const usertype = localStorage.getItem('usertype');

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}orderdetails/${orderid}`);
            setOrderDetails(response.data);
        } catch (error) {
            console.error("Error!! can't fetch orders", error);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderid]);

    const handleProductClick = (productid) => {
        navigate(`/product/${productid}`);
    };

    const removeItemFromOrder = () => {
        console.log('removing product from order')
    }

    const order = orderDetails.length > 0 ? orderDetails[0] : null;

    return (
        <>
            <section className="blog about-blog">
                <div className="container">
                    {/* <div className="blog-bradcrum">
            <span><a href="/">Home</a></span>
            <span className="devider">/</span>
            <span><a href="OrderHistory">Orders</a></span>
            <span className="devider">/</span>
            <span><a href="OrderDetail">OrderDetails</a></span>
          </div> */}
                    <div className="blog-heading about-heading">
                        <h1 className="heading">Order Details</h1>
                    </div>
                </div>
            </section>
            <section className="user-profile footer-padding">
                <div className="container">
                    <div className="user-profile-section box-shadows">
                        <div className="user-dashboard">
                            <DashboardRoutes />
                            <div className="container mt-5">
                                <h2 className="mb-4 main-heading-custom-font-1">Order Summary - {order && order.srno}</h2>
                                <div className="card">
                                    {order ? (
                                        <div className="card-body">
                                            <p><strong>Order Date & Time :</strong> {order.order_date} {order.order_time} | <strong>Order# :</strong> {order.order_id} | <strong>Order ID :</strong> {order.srno}</p>

                                            <div className="row my-5">
                                                <div className="col-sm-12 text-custom-font-1">
                                                    <div className='heading-custom-font-1'>Shipping Address</div>
                                                    <strong>Name :</strong> {order.name}
                                                    <p><strong>Address :</strong> {order.line1}, {order.city}</p>
                                                    <p><strong>Landmark :</strong> {order.landmark}</p>
                                                    <span><strong>Contact: </strong>{order.contact}, {order.alternatecontact}</span>
                                                </div>
                                            </div>

                                            <div className="row my-5">
                                                <div className="col-sm-12">
                                                    <div className='heading-custom-font-1'>Bill Details</div>
                                                    <ul className="list-group text-custom-font-1">
                                                        <li className="list-group-item">Total Amount - {order.paymentamount}</li>
                                                        <li className="list-group-item">Delivery Charge - 20</li>
                                                        <li className="list-group-item">Promotional Discount - 20</li>
                                                        <li className="list-group-item text-success"><strong>Final Payment Amount - {order.paymentamount}</strong></li>
                                                        <li className="list-group-item">Payment Mode - {order.paymentmode}</li>
                                                    </ul>
                                                </div>
                                            </div>


                                            <div className="my-5">
                                                <div className='heading-custom-font-1'>Items List</div>
                                                {(usertype === 'admin') && <div className="shop-btn mx-1">Add Product to existing order</div>}
                                                {orderDetails.map((item, index) => {
                                                    return (
                                                        <div className="card mb-1" key={index} style={{ cursor: 'pointer' }} onClick={() => handleProductClick(item.productid)}>
                                                            <div className="card-body d-flex align-items-center">
                                                                <div className="col-md-3">
                                                                    <img src="https://picsum.photos/50" className="img-fluid" alt="dummy" />
                                                                </div>
                                                                <div className="col-md-9 d-flex justify-content-between align-items-center">
                                                                    <p><strong>{item.prod_name}</strong></p>
                                                                    <p><strong>Qty: {item.quantity}</strong></p>
                                                                    <p><strong>&#8377;&nbsp;{item.price_final}</strong></p>
                                                                    {(usertype === 'admin') && <button onClick={removeItemFromOrder} className="shop-btn">Remove Product</button>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className='heading-custom-font-1 my-5'>Order Status : {order.delivery_status} </div>
                                            <div className="text-center">
                                                <Link to={`/orderhistory/orderdetailsprint/${orderid}/vendor`} className="shop-btn mx-1">Print for Vendor</Link>
                                                <Link to={`/orderhistory/orderdetailsprint/${orderid}/customer`} className="shop-btn mx-1">Print for Customer</Link>
                                                <Link to={`/orderhistory/orderdetailsprint/${orderid}/partner`} className="shop-btn mx-1">Print for Delivery Partner</Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>No order found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default OrderDetail;
