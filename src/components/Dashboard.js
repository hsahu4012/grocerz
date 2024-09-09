import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardRoutes from './DashboardRoutes';

const Dashboard = () => { 
  const initialState = {
    name: '-',
    email: '-',
    mobile: '-',
  };

  const [userDetails, setUserDetails] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [userOrders, setUserOrders] = useState(0);
  const userid = localStorage.getItem('userid');
  const userRole = localStorage.getItem('role');

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}users/searchuser/${userid}`
      );
      setUserDetails({
        name: response.data[0].name,
        email: response.data[0].email,
        mobile: response.data[0].mobile
      });

      const userOrdersResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getOrderCountByUserId/${userid}`
      );
      setUserOrders(userOrdersResponse.data.totalOrders);
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserDetails = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}users/updateusers/${userid}`, {
        name: userDetails.name,
        email: userDetails.email,
        mobile: userDetails.mobile
      });
      console.log('User details updated:', response.data);
      setIsEditing(false); // Exit editing mode after updating
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDetails();
  }, []);

  return (
    <>
      <section className="blog about-blog">
        <div className="container">
          <div className="blog-heading about-heading">
            <h1 className="heading">User Dashboard</h1>
          </div>
        </div>
      </section>

      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              <DashboardRoutes />

              <div className='tab-content nav-content' id='v-pills-tabContent' style={{ flex: '1 0%' }}>
                <div className='tab-pane fade show active' id='v-pills-home' role='tabpanel' aria-labelledby='v-pills-home-tab'>
                  <div className='user-profile'>
                    <div className='user-title'>
                      <p className='paragraph'>Hello {userDetails.name} </p>
                      <h5 className='heading'>Welcome to your Profile </h5>
                    </div>

                    <div className='profile-section'>
                      <div className='row g-5'>
                        <div className='col-lg-4 col-sm-6'>
                          <div className='product-wrapper'>
                            <div className='wrapper-img'>
                              <span>
                                <svg width={62} height={62} viewBox='0 0 62 62' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                  <rect width={62} height={62} rx={4} />
                                  <path d='M45.4473 20.0309C45.482 20.3788 45.5 20.7314 45.5 21.0883C45.5 26.919 40.7564 31.6625 34.9258 31.6625C29.0951 31.6625 24.3516 26.919 24.3516 21.0883C24.3516 20.7314 24.3695 20.3788 24.4042 20.0309H21.9805L21.0554 12.6289H13.7773V14.7438H19.1884L21.5676 33.7774H47.1868L48.8039 20.0309H45.4473Z' />
                                  <path d='M22.0967 38.0074H19.0648C17.3157 38.0074 15.8926 39.4305 15.8926 41.1797C15.8926 42.9289 17.3157 44.352 19.0648 44.352H19.2467C19.1293 44.6829 19.0648 45.0386 19.0648 45.4094C19.0648 47.1586 20.4879 48.5816 22.2371 48.5816C24.4247 48.5816 25.9571 46.4091 25.2274 44.352H35.1081C34.377 46.413 35.9157 48.5816 38.0985 48.5816C39.8476 48.5816 41.2707 47.1586 41.2707 45.4094C41.2707 45.0386 41.2061 44.6829 41.0888 44.352H43.3856V42.2371H19.0648C18.4818 42.2371 18.0074 41.7628 18.0074 41.1797C18.0074 40.5966 18.4818 40.1223 19.0648 40.1223H46.4407L46.9384 35.8926H21.8323L22.0967 38.0074Z' />
                                  <path d='M34.9262 29.5477C39.5907 29.5477 43.3856 25.7528 43.3856 21.0883C43.3856 16.4238 39.5907 12.6289 34.9262 12.6289C30.2616 12.6289 26.4668 16.4238 26.4668 21.0883C26.4668 25.7528 30.2617 29.5477 34.9262 29.5477ZM33.8688 17.916H35.9836V20.6503L37.7886 22.4554L36.2932 23.9508L33.8687 21.5262V17.916H33.8688Z' />
                                </svg>
                              </span>
                            </div>
                            <div className='wrapper-content'>
                              <p className='paragraph'>Your Orders</p>
                              <h3 className='heading'>{userOrders}</h3>
                            </div>
                          </div>
                        </div>

                        <div className='col-lg-4 col-sm-6'>
                          <div className='product-wrapper'>
                            <div className='wrapper-img'>
                              <span>
                                <svg width={62} height={62} viewBox='0 0 62 62' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                  <rect width={62} height={62} rx={4} fill='white' />
                                  <path d='M45.2253 29.8816H44.4827L43.6701 26.3651C43.376 25.1043 42.2552 24.2217 40.9662 24.2217H36.8474V20.8453C36.8474 19.038 35.3764 17.5811 33.5831 17.5811H18.1724C16.4631 17.5811 15.0762 18.968 15.0762 20.6772V37.0967C15.0762 38.8058 16.4631 40.1928 18.1724 40.1928H19.2931C19.8955 42.1962 21.7448 43.6533 23.9304 43.6533C26.1159 43.6533 27.9792 42.1962 28.5816 40.1928C28.8455 40.1928 35.3459 40.1928 35.1942 40.1928C35.7966 42.1962 37.6459 43.6533 39.8315 43.6533C42.031 43.6533 43.8803 42.1962 44.4827 40.1928H45.2253C46.7663 40.1928 47.9992 38.96 47.9992 37.4179V32.6566C48.0004 31.1143 46.7675 29.8816 45.2253 29.8816ZM23.9304 39.1036C22.4764 39.1036 21.294 37.9211 21.294 36.4672C21.294 35.0133 22.4764 33.8309 23.9304 33.8309C25.3843 33.8309 26.5668 35.0133 26.5668 36.4672C26.5668 37.9211 25.3843 39.1036 23.9304 39.1036ZM35.0725 33.8309H33.4724V32.2308H36.8267V36.8267H35.0725V33.8309ZM39.8315 39.1036C38.3776 39.1036 37.1951 37.9211 37.1951 36.4672C37.1951 35.0133 38.3776 33.8309 39.8315 33.8309C41.2854 33.8309 42.4679 35.0133 42.4679 36.4672C42.4679 37.9211 41.2854 39.1036 39.8315 39.1036Z' />
                                </svg>
                              </span>
                            </div>
                            <div className='wrapper-content'>
                              <p className='paragraph'>Total Spendings</p>
                              <h3 className='heading'>{userOrders}</h3>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User Information Section */}
                      <div className='row mt-4'>
                      <div className="col-lg-12">
                          <div className="info-section">
                            <div className="seller-info">
                              <h5 className="heading">Personal Information</h5>
                              <div className="info-list">
                              {isEditing ? (
                        <div className='Edit-fields'>
                          <p>Name: <input type="text" style={{ border: "2px solid #34A853", borderRadius:"5px", paddingLeft:"2px"}} name="name" value={userDetails.name}  onChange={handleInputChange} /></p>
                          <p>Email: <input type="text" style={{ border: "2px solid #34A853", borderRadius:"5px", paddingLeft:"2px", margin: "5px 0" }} name="email" value={userDetails.email} onChange={handleInputChange} /></p>
                          <p>Phone: <input type="text" style={{ border: "2px solid #34A853", borderRadius:"5px", paddingLeft:"2px", marginBottom: "5px"}} name="mobile" value={userDetails.mobile} onChange={handleInputChange} /></p>
                          <button style={{backgroundColor: "#34A853", fontSize: "15px", color: "white", borderRadius: "5px", height:"25px", width: "50px"}} onClick={updateUserDetails}>Update</button>
                          <button style={{backgroundColor: "#FF0000", fontSize: "15px", color: "white", borderRadius: "5px", height:"25px", width: "50px", marginLeft: "10px"}} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                        ) : (
                        <div>
                          <p>Name:  {userDetails.name}</p>
                          <p style={{ margin: "5px 0"}}>Email:  {userDetails.email}</p>
                          <p style={{ marginTop: "6.5px", marginBottom: "5.5px"}}>Phone:  {userDetails.mobile}</p>
                          <button style={{backgroundColor: "#34A853", fontSize: "15px", color: "white", borderRadius: "5px", height:"25px", width: "50px"}} onClick={() => setIsEditing(true)}>Edit</button>
                        </div>
                        )}
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
        </div>
        </div>

      </section>
    </>
  );
};


export default Dashboard;
