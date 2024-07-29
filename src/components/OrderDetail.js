import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import DashboardRoutes from './DashboardRoutes'; // Assuming you have this component

const OrderDetail = () => {
    const { orderid } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const navigate = useNavigate();

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

    const order = orderDetails.length > 0 ? orderDetails[0] : null;

    return (
        <>
        <section className="blog about-blog">
        <div className="container">
          <div className="blog-bradcrum">
            <span><a href="/">Home</a></span>
            <span className="devider">/</span>
            <span><a href="OrderHistory">Orders</a></span>
            <span className="devider">/</span>
            <span><a href="OrderDetail">OrderDetails</a></span>
          </div>
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
                            <h2 className="mb-4">Order Summary</h2>
                            <div className="card">
                                {order ? (
                                    <div className="card-body">
                                        <p><strong>Ordered on :</strong> {order.order_date} {order.order_time} | <strong>Order# :</strong> {order.order_id}</p>
                                        <h4>Products</h4>
                                        <div className="mb-4">
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
                                                                <p><strong>${item.price}</strong></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h6>Shipping Address</h6>
                                                <strong>Name :</strong> {order.name}
                                                <p><strong>Address :</strong> {order.line1}, {order.line2}, {order.line3}, {order.city}, {order.country}</p>
                                                <span><strong>Contact: </strong>{order.contact}</span>
                                            </div>
                                            <div className="col-md-6">
                                                <h5>Bill Details</h5>
                                                <ul className="list-group">
                                                    <li className="list-group-item">Final Price - {order.price_final}</li>
                                                    <li className="list-group-item">Payment Amount - {order.paymentamount}</li>
                                                    <li className="list-group-item">Payment Mode - {order.paymentmode}</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <h5>Order Status : {order.delivery_status} </h5>
                                        <div className="text-center">
                                            <button className="btn btn-primary mx-1">Buy it again</button>
                                            <button className="btn btn-primary mx-1">Write a product review</button>
                                            <button className="btn btn-primary mx-1">Download Invoice</button>
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
