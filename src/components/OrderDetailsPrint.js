import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardRoutes from './DashboardRoutes'; // Assuming you have this component

const OrderDetailsPrint = () => {
    const { orderid, usertype } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const navigate = useNavigate();

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}orderdetails/${orderid}`);
            setOrderDetails(response.data);
            console.log("orderdeatilspage")
        } catch (error) {
            console.error("Error!! can't fetch orders", error);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
        console.log(orderid, usertype)
    }, [orderid]);

    const handleProductClick = (productid) => {
        navigate(`/product/${productid}`);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                        <h1 className="heading">Grocji - Order Details</h1>
                    </div>
                </div>
            </section>
            <section className="user-profile footer-padding">
                <div className="container">
                    <div className="user-profile-section box-shadows">
                        <div className="user-dashboard">

                            <div className="container mt-5">
                                <h2 className="mb-4 main-heading-custom-font-1">Order Summary - {order && order.srno}</h2>
                                <div className="card">
                                    {order ? (
                                        <div className="card-body">
                                            <p><strong>Order Date & Time :</strong> {order.order_date} {order.order_time} | <strong>Order ID :</strong> {order.order_id}| <strong>Order Number :</strong> {order.srno}</p>


                                            {(usertype !== 'vendor') && <div className="row my-5">
                                                <div className="col-sm-12 text-custom-font-1">
                                                    <div className='heading-custom-font-1'>Shipping Address</div>
                                                    <strong>Name :</strong> {order.name}
                                                    <p><strong>Address :</strong> {order.line1}, {order.city}</p>
                                                    <p><strong>Landmark :</strong> {order.landmark}</p>
                                                    <span><strong>Contact: </strong>{order.contact}, {order.alternatecontact}</span>
                                                </div>
                                            </div>}

                                            {(usertype !== 'vendor') && <div className="row my-5">
                                                <div className="col-sm-12">
                                                    <div className='heading-custom-font-1'>Bill Details</div>
                                                    <ul className="list-group text-custom-font-1">
                                                        {/* <li className="list-group-item">Total Amount - {order.paymentamount}</li>
                                                        <li className="list-group-item">Delivery Charge - 0</li>
                                                        <li className="list-group-item">Promotional Discount - 0</li> */}
                                                        <li className="list-group-item text-success"><strong>Final Payment Amount - {order.paymentamount}</strong></li>
                                                        <li className="list-group-item">Payment Mode - {order.paymentmode}</li>
                                                    </ul>
                                                </div>
                                            </div>}


                                            <div className="my-5">
                                                <div className='heading-custom-font-1'>Items List</div>
                                                {orderDetails.map((item, index) => {
                                                    return (
                                                        <div className="card mb-1" key={index} style={{ cursor: 'pointer' }} onClick={() => handleProductClick(item.productid)}>
                                                            <div className="card-body d-flex align-items-center">
                                                                {/* <div className="col-md-3">
                                                                    <img src="https://picsum.photos/50" className="img-fluid" alt="dummy" />
                                                                </div> */}
                                                                <div className="col-sm-12 d-flex justify-content-between align-items-center">
                                                                    <p><strong>{index+1}</strong></p>
                                                                    <p><strong>Name - {item.prod_name}</strong></p>
                                                                    <p><strong>Quantity - {item.quantity}</strong></p>
                                                                    {(usertype !== 'vendor') && <p><strong>&#8377;&nbsp;{item.price_final}</strong></p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <p>No order found.</p>
                                    )}
                                </div>
                            </div>

                            <Link to={`/orderhistory/orderdetail/${orderid}`} className="shop-btn">Back</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default OrderDetailsPrint;
