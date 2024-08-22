// OrderHistory.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';

const OrderHistory = () => {



  const userid = localStorage.getItem('userid');
  const usertype = localStorage.getItem('usertype');

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const handleOrderClick = (orderid) => {
    navigate(`/orderhistory/orderdetail/${orderid}`);
  };
  const handleMarkComplete = async (orderid) => {
    try {
      const url = process.env.REACT_APP_API_URL + "orders/markascompleted/" + orderid;
      const response = await axios.put(url);
      fetchOrders();
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };
  const handleOrderCancel = async (orderid) => {
    try {
      const url = process.env.REACT_APP_API_URL + "orders/markascancelled/" + orderid;
      const response = await axios.put(url);
      fetchOrders();
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };
  const handleDelivered = async (orderid) => {
    try {
      const url = process.env.REACT_APP_API_URL + "orders/markdelivered/" + orderid;
      const response = await axios.put(url);
      fetchOrders();
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };
  const handleDeliveryCancel = async (orderid) => {
    try {
      const url = process.env.REACT_APP_API_URL + "orders/markdeliverycancelled/" + orderid;
      const response = await axios.put(url);
      fetchOrders();
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };
  const fetchOrders = async () => {
    try {
      const url = (usertype !== 'user') ? 'orders/allOrders' : 'orders/getByuserId/' + userid;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}${url}`);
      setOrders(response.data);
      console.log("Orders ", orders)
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <section className="blog about-blog">
        <div className="container">
          {/* <div className="blog-bradcrum">
            <span><a href="/">Home</a></span>
            <span className="devider">/</span>
            <span><a href="OrderHistory">Orders</a></span>
          </div> */}
          <div className="blog-heading about-heading">
            <h1 className="heading">Orders</h1>
          </div>
        </div>
      </section>
      <section className="user-profile footer-padding">
        <div className="container">
          <div className="user-profile-section box-shadows">
            <div className="user-dashboard">
              <DashboardRoutes />
              <div className="container">
                <h3>All Orders</h3>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <div key={index} className="card mt-3">
                      <div className="card-body">
                        <div className="row">
                          {/* <div className="col-md-3">
                            <img src="https://picsum.photos/500/200" className="img-fluid" alt="dummy" />
                          </div> */}
                          <div className="col-sm-12 ">
                            {/* <h5 className="card-title">
                              
                              <strong style={{ cursor: 'pointer' }} onClick={() => handleOrderClick(order.order_id)}>
                                {index+1}.ORD ID {order.order_id} , Total ₹{order.paymentamount}
                              </strong>
                            </h5> */}
                            {/* <div className='row'>
                              <div className='col-9'>
                                <h5 className="card-title">
                                  <strong style={{ cursor: 'pointer' }} onClick={() => handleOrderClick(order.order_id)}>
                                    Order NO - {order.srno}. Total ₹{order.paymentamount}
                                  </strong>
                                </h5>
                              </div>

                              <div className='col-2 button-container'>
                                <button className="view_details_btn shop-btn shop-btn-nomargin" onClick={() => handleOrderClick(order.order_id)}>
                                  View Details
                                </button>
                              </div>
                              <div className='col-2 button-container'>
                              <button className="view_details_btn shop-btn shop-btn-nomargin" onClick={() => handleOrderClick(order.order_id)}>
                                  Mark Complete
                                </button>
                              </div>

                            </div> */}
                            <div className='order-card'>
                              <div className='order-details'>
                                <h5 className="card-title">
                                  <strong style={{ cursor: 'pointer' }} onClick={() => handleOrderClick(order.order_id)}>
                                    Order NO - {order.srno}. Total ₹{order.paymentamount}
                                  </strong>
                                </h5>
                              </div>

                              {
                                usertype === 'admin' &&
                                <div className='order-actions'>
                                  {(order.order_status === 'Placed') && <button className="mark-cancelled-btn" onClick={() => handleOrderCancel(order.order_id)}>
                                    Cancel Order
                                  </button>}
                                  <button className="view-details-btn" onClick={() => handleOrderClick(order.order_id)}>
                                    View Details
                                  </button>
                                  {(order.delivery_status !== 'DELIVERED') && <button className="mark-complete-btn" onClick={() => handleDelivered(order.order_id)}>
                                    Mark Delivered
                                  </button>}
                                  {(order.order_status !== 'COMPLETED') && <button className="mark-complete-btn" onClick={() => handleMarkComplete(order.order_id)}>
                                    Mark Complete
                                  </button>}
                                </div>
                              }
                              {
                                usertype === 'deliverypartner' && <div className='order-actions'>
                                  {/* {(order.delivery_status!=='CANCELLED' ) &&<button className="mark-cancelled-btn" onClick={() => handleDeliveryCancel(order.order_id)}>
                                  Cancel Delivery
                                </button> } */}
                                  <button className="view-details-btn" onClick={() => handleOrderClick(order.order_id)}>
                                    View Details
                                  </button>
                                  {(order.delivery_status !== 'DELIVERED') && <button className="mark-complete-btn" onClick={() => handleDelivered(order.order_id)}>
                                    Mark Delivered
                                  </button>}
                                </div>
                              }

                              {
                                usertype === 'user' && <div className='order-actions'>
                                  
                                  <button className="view-details-btn" onClick={() => handleOrderClick(order.order_id)}>
                                    View Details
                                  </button>
                                 
                                </div>
                              }
                            </div>


                            <div className='text-end'>



                            </div>
                            <p><strong>Order ID - </strong> {order.order_id}</p>
                            <p><strong>Placed on - </strong> {order.order_date}, {order.order_time}</p>
                            <p><strong>Order Status -</strong> {order.order_status}</p>
                            <p><strong>Delivery Status -</strong> {order.delivery_status}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No orders found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};


export default OrderHistory;
