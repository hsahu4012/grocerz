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
    // if (!userid) {
    //   navigate('/login');
    //   navigate(`/ordersuccess/${orderid}`);
    //   return;
    // }
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

                      {/* <div col-12>
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
                      </div> */}


                      <table className='table table-borderd table-striped'>
                        <tbody>
                          <tr className='fs-3'>
                            <th className=''>
                              Order Id
                            </th>
                            <td className=''>
                              {order.order_id || 'N/A'}
                            </td>
                          </tr>

                          <tr className='fs-3'>
                            <th className=''>
                                Total Amount
    
                            </th>
                            <td className=''>
                              {order?.paymentamount || 'N/A'}
                            </td>
                          </tr>

                          <tr className='fs-3'>
                            <th className=''>
                            
                                Placed On
                              
                            </th>
                            <td className=''>
                              {order.order_date}{' | '}
                                {order.order_time}
                            </td>
                          </tr>

                          <tr className='fs-3'>
                            <th className=''>
                              
                                 Delivery Status
                              
                            </th>
                            <td className=''>
                              {order.delivery_status || 'N/A'}
                            </td>
                          </tr>
                        </tbody>
                      </table>


                      <p className="fw-semibold text-center mt-4">

                        Thank you for shopping with us. Your order details will be emailed to you shortly.

                      </p>
                      <div className='d-flex flex-wrap gap-3 align-items-center justify-content-center mt-4'style={{height:'150px'}}>

                        <div className=''style={{height:'70px'}}>
                          <Link to="/orderhistory" className="shop-btn btn-success px-4">View Order History</Link>
                        </div>
                      

                      <div className=''style={{height:'70px'}}>
                        <a className='shop-btn px-4' rel='noreferrer' target='_blank' href="https://api.whatsapp.com/send?phone=918757499345&text=I would like to request login credentials">
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
        </div>
      </section>
    </>
  );
};

export default OrderPlaced;
