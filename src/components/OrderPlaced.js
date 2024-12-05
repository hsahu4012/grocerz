import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';

const OrderPlaced = () => {
  const userid = localStorage.getItem('userid');
  const usertype = localStorage.getItem('usertype');
  const { orderid } = useParams();
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchOrderDetails = async () => {
    try {

      setLoading(true);
      const url = (
        `${process.env.REACT_APP_API_URL}orderdetails/${orderid}`
      );
      console.log('Fetching from URL:', url);
      const response = await axios.get(url);
      console.log('API Response:', response.data);
      setOrderDetails(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Something went wrong, please try again!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userid) {
      //navigate('/login');
      navigate(`/ordersuccess/${orderid}`);
      return;
    }
    window.scrollTo(0, 0);
    fetchOrderDetails();
  }, [orderid, userid, navigate]);

  if (!orderDetails) {
    return <div className="text-center"><p>No order details found!</p></div>;
  }

  // const {
  //   order_id,
  //   paymentamount,
  //   order_date,
  //   order_time,
  //   delivery_status
  // } = orderDetails;
  const order = orderDetails.length > 0 ? orderDetails[0] : null;


  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          {/* <span>
              <Link to='/home'>Home</Link>
            </span>
            <span className='devider'> / </span>
            <span>
              <Link to='/cart'>Cart</Link>
            </span>
            <span className='devider'> / </span>
            <span>
              <Link to='/checkout'>Checkout</Link>
            </span>
            <span className='devider'> / </span>
            <span>Order Successful</span> */}
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Your Order is Placed Successfully!</h1>
          </div>
        </div>
      </section>

      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              {/* <DashboardRoutes /> */}
              <div className="container">
                <div className="row">
                  <div >
                    <div className="text-center mt-10 text-custom-font-1">

                      <div col-12>
                        Order Id - {order.srno || 'N/A'}
                      </div>

                      <div col-12>
                        Total Amount - {order.paymentamount || 'N/A'}
                      </div>

                      <div col-12>
                        Placed On - {order.order_date}{' | '}
                      </div>

                      <div col-12>
                        Delivery Status - {order.delivery_status || 'N/A'}
                      </div>


                      {/* <table className='table table-responsive'>
                        <tbody>
                          <tr className='table-row table-top-row'>
                            <td className='table-wrapper wrapper-product'>
                              <h4 className='table-heading'>Order Id</h4>
                            </td>
                            <td className='table-wrapper'>
                              <h4 className='table-heading'>{order.order_id || 'N/A'}</h4>
                            </td>
                          </tr>

                          <tr className='table-row table-top-row'>
                            <td className='table-wrapper'>
                              <div className='table-wrapper-center'>
                                <h4 className='table-heading'>Total Amount</h4>
                              </div>
                            </td>
                            <td className='table-wrapper'>
                              <h4 className='table-heading'>{order.paymentamount || 'N/A'}</h4>
                            </td>
                          </tr>

                          <tr className='table-row table-top-row'>
                            <td className='table-wrapper'>
                              <div className='table-wrapper-center'>
                                <h4 className='table-heading'>Placed On</h4>
                              </div>
                            </td>
                            <td className='table-wrapper'>
                              <h4 className='table-heading'>{order.order_date}{' | '}
                                {order.order_time}</h4>
                            </td>
                          </tr>

                          <tr className='table-row table-top-row'>
                            <td className='table-wrapper'>
                              <div className='table-wrapper-center'>
                                <h4 className='table-heading'> Delivery Status</h4>
                              </div>
                            </td>
                            <td className='table-wrapper'>
                              <h4 className='table-heading'>{order.delivery_status || 'N/A'}</h4>
                            </td>
                          </tr>
                        </tbody>
                      </table> */}


                      <p className="fw-semibold text-center mt-4">

                        Thank you for shopping with us. Your order details will be emailed to you shortly.

                      </p>
                      <div className="mt-4">
                        <button className='clean-btn shop-btn mr-3 my-5 px-5 mx-5'>
                          <Link to="/orderhistory" className="text-white">View Order History</Link>
                        </button>
                      </div>

                      <div class='login-btn text-center my-1'>
                        <a class='shop-btn' target='_blank' href="https://api.whatsapp.com/send?phone=918757499345&text=I would like to request login credentials">
                          Get Login Credential From Whatsapp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderPlaced;
