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
  const fetchOrders = async () => {
    try {
      const url = (usertype === 'admin') ? 'orders/allOrders' : 'orders/getByuserId/'+userid;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}${url}`);
      setOrders(response.data);
      console.log("Orders ",orders)
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
            <div className="blog-bradcrum">
              <span><a href="/">Home</a></span>
              <span className="devider">/</span>
              <span><a href="OrderHistory">Orders</a></span>
          </div>
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
              <div className="container mt-4">
                <h2>All Orders</h2>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <div key={index} className="card mt-3">
                      <div className="card-body">
                        <div className="row">
                          {/* <div className="col-md-3">
                            <img src="https://picsum.photos/500/200" className="img-fluid" alt="dummy" />
                          </div> */}
                          <div className="col-sm-12">
                            <h5 className="card-title">
                              
                              <strong style={{ cursor: 'pointer' }} onClick={() => handleOrderClick(order.order_id)}>
                                {index+1}.ORD ID {order.order_id} , Total ₹{order.paymentamount}
                              </strong>
                            </h5>
                            <div className='text-end'>

                              <button className="view_details_btn success" onClick={() => handleOrderClick(order.order_id)}>
                                View Details
                              </button>

                            </div>
                            <p><strong>Placed on:</strong> {order.order_date}, {order.order_time}</p>
                            <p>{order.delivery_status}</p>
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
