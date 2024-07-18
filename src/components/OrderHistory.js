// OrderHistory.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  // const dummyOrders = [
  //   {
  //     productName: "Hghbjhn yguhj ghjn fghjn ghjnm",
  //     color: "Black",
  //     size: "M",
  //     price: "208",
  //     deliveryDate: "Feb 23",
  //     deliveryStatus: "Your item has been delivered",
  //     cancellationReason: null
  //   },
  //   {
  //     productName: "FLbhbhj hghv",
  //     color: "Black",
  //     size: "8",
  //     price: "305",
  //     deliveryDate: "Nov 20, 2023",
  //     deliveryStatus: "Cancelled",
  //     cancellationReason: "You requested a cancellation because you changed your mind about this product."
  //   },
  //   {
  //     productName: "Healthnmn Tempered Glass LCD Dis...",
  //     color: "Brushed Black",
  //     price: "553",
  //     deliveryDate: "Nov 20, 2023",
  //     deliveryStatus: "Cancelled",
  //     cancellationReason: "You requested a cancellation because you changed your mind about this product."
  //   }
  // ];



  const userid = localStorage.getItem('userid');

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const handleOrderClick = (orderid) => {
    navigate(`orderdetail/${orderid}`);
  };
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}orders/getByuserId/${userid}`);
      setOrders(response.data);


    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Order History</h2>
      {orders.length > 0 ? (
        orders.map((order, index) => (
          <div key={index} className="card mt-3 ">
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <img src="https://picsum.photos/500/200" className="img-fluid" alt="dummy" />
                </div>
                <div className="col-md-9">
                  <h5 className="card-title">
                    <strong style={{ cursor: 'pointer' }} onClick={() => handleOrderClick(order.order_id)}>
                      ORD {order.order_id}. Total ₹{order.paymentamount}
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
  );
};


export default OrderHistory;
