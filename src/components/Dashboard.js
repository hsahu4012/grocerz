import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
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

  const [userOrders, setUserOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const userid = localStorage.getItem('userid');
  const userRole = localStorage.getItem('role');

  const fetchDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}users/searchuser/${userid}`);
      setUserDetails({
        name: response.data[0].name,
        email: response.data[0].email,

        mobile: response.data[0].mobile
      });

      const userOrdersResponse = await axios.get(`${process.env.REACT_APP_API_URL}orders/getOrderCountByUserId/${userid}`);
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

      <section className="user-profile footer-padding">
        <div className="container">
          <div className="user-profile-section box-shadows">
            <div className="user-dashboard">
              <DashboardRoutes />

              <div className="tab-content nav-content" id="v-pills-tabContent" style={{ flex: "1 0%" }}>
                <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab" tabIndex={0}>
                  <div className="user-profile">
                    <div className="user-title">
                      <p className="paragraph">Hello {userDetails.name}</p>
                      <h5 className="heading">Welcome to your Profile</h5>
                    </div>
                    <div className="profile-section">
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
                      <div className="row g-5">
                        <div className="col-lg-4 col-sm-6">
                          <div className="product-wrapper">
                            <div className="wrapper-img">
                              <span>
                                <svg
                                  width={62}
                                  height={62}
                                  viewBox="0 0 62 62"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect width={62} height={62} rx={4} />
                                  <path d="M45.4473 20.0309C45.482 20.3788 45.5 20.7314 45.5 21.0883C45.5 26.919 40.7564 31.6625 34.9258 31.6625C29.0951 31.6625 24.3516 26.919 24.3516 21.0883C24.3516 20.7314 24.3695 20.3788 24.4042 20.0309H21.9805L21.0554 12.6289H13.7773V14.7438H19.1884L21.5676 33.7774H47.1868L48.8039 20.0309H45.4473Z" />
                                  <path d="M22.0967 38.0074H19.0648C17.3157 38.0074 15.8926 39.4305 15.8926 41.1797C15.8926 42.9289 17.3157 44.352 19.0648 44.352H19.2467C19.1293 44.6829 19.0648 45.0386 19.0648 45.4094C19.0648 47.1586 20.4879 48.5816 22.2371 48.5816C24.4247 48.5816 25.9571 46.4091 25.2274 44.352H35.1081C34.377 46.413 35.9157 48.5816 38.0985 48.5816C39.8476 48.5816 41.2707 47.1586 41.2707 45.4094C41.2707 45.0386 41.2061 44.6829 41.0888 44.352H43.3856V42.2371H19.0648C18.4818 42.2371 18.0074 41.7628 18.0074 41.1797C18.0074 40.5966 18.4818 40.1223 19.0648 40.1223H46.4407L46.9384 35.8926H21.8323L22.0967 38.0074Z" />
                                  <path d="M34.9262 29.5477C39.5907 29.5477 43.3856 25.7528 43.3856 21.0883C43.3856 16.4238 39.5907 12.6289 34.9262 12.6289C30.2616 12.6289 26.4668 16.4238 26.4668 21.0883C26.4668 25.7528 30.2617 29.5477 34.9262 29.5477ZM33.8688 17.916H35.9836V20.6503L37.7886 22.4554L36.2932 23.9508L33.8687 21.5262V17.916H33.8688Z" />
                                </svg>
                              </span>
                            </div>
                            <div className="wrapper-content">
                            <p className="paragraph">Your Orders</p>
                            <h3 className="heading">{userOrders}</h3>
                        
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-sm-6">
                          <div className="product-wrapper">
                            <div className="wrapper-img">
                              <span>
                                <svg
                                  width={62}
                                  height={62}
                                  viewBox="0 0 62 62"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect width={62} height={62} rx={4} fill="white" />
                                  <path
                                    d="M26.7975 34.4331C23.7162 36.0289 22.9563 36.8019 21.6486 39.6816C20.7665 38.8387 19.9011 38.0123 19.0095 37.1599C19.5288 36.3146 20.0327 35.4942 20.5353 34.6726C20.8803 34.1071 20.4607 33.0579 19.8228 32.899C18.8862 32.6666 17.9484 32.4426 17 32.2114C17 30.4034 17 28.6274 17 26.7827C17.9212 26.561 18.8542 26.3405 19.7849 26.1117C20.4678 25.9433 20.8922 24.9048 20.527 24.306C20.0339 23.4987 19.5371 22.6925 19.0605 21.916C20.3551 20.6201 21.6225 19.354 22.9243 18.0534C23.7067 18.5335 24.5283 19.0398 25.3535 19.5425C25.887 19.8673 26.9433 19.4452 27.0927 18.8442C27.3262 17.9064 27.5491 16.965 27.7839 16C29.5883 16 31.3785 16 33.2197 16C33.4366 16.907 33.6548 17.8234 33.8777 18.7386C34.0555 19.4678 35.0763 19.8969 35.7082 19.5093C36.5144 19.0149 37.3182 18.5205 38.0829 18.051C39.3763 19.3445 40.6318 20.6 41.943 21.9124C41.4783 22.6723 40.9756 23.4904 40.4753 24.3108C40.1114 24.9071 40.5405 25.9398 41.2258 26.1081C42.1434 26.3334 43.0646 26.5503 44 26.7756C44 28.5954 44 30.3892 44 32.2197C43.1298 32.426 42.2667 32.6287 41.4048 32.8338C40.4658 33.0579 40.0651 34.0122 40.5654 34.8267C41.029 35.5819 41.4914 36.3383 41.9727 37.122C41.1487 38.004 40.3473 38.8612 39.4901 39.7776C38.5393 37.1741 36.8297 35.4243 34.3163 34.4592C37.5565 31.5332 36.8558 27.4668 34.659 25.411C32.2973 23.1999 28.5995 23.2616 26.3138 25.5639C24.1537 27.7406 23.7186 31.6885 26.7975 34.4331Z"
                                    fill="#FFBB38"
                                  />
                                  <path
                                    d="M38.0695 46.3142C33.0415 46.3142 28.0847 46.3142 23.0389 46.3142C23.0389 45.9763 23.0342 45.6491 23.0401 45.3219C23.0626 44.0391 22.9796 42.7421 23.1361 41.4747C23.5357 38.2571 26.1261 35.9239 29.3722 35.8208C30.5886 35.7817 31.8417 35.7757 33.0249 36.0164C35.8643 36.595 37.8916 39.0254 38.0552 41.9359C38.1359 43.3704 38.0695 44.8133 38.0695 46.3142Z"
                                    fill="#FFBB38"
                                  />
                                  <path
                                    d="M30.5375 33.9233C28.2244 33.9091 26.3501 32.011 26.3832 29.7193C26.4176 27.4122 28.3169 25.5568 30.6157 25.584C32.8849 25.6101 34.7486 27.5011 34.7403 29.7691C34.7332 32.075 32.8481 33.9375 30.5375 33.9233Z"
                                    fill="#FFBB38"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div className="wrapper-content">
                              <p className="paragraph">Support Tickets</p>
                              <h3 className="heading">-</h3>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-lg-12">
                          <div className="info-section">
                            <div className="seller-info">
                              <h5 className="heading">Personal Information</h5>
                              <div className="info-list">
                                <div className="info-title">
                                  <p>Name:</p>
                                  <p>Email:</p>
                                  <p>Phone:</p>
                                  {/* <p>City:</p>
                                <p>Zip:</p> */}
                                </div>
                                <div className="info-details">
                                  <p>{userDetails.name}</p>
                                  <p>{userDetails.email}</p>
                                  <p>{userDetails.phone}</p>
                                  {/* <p>-</p>
                                <p>-</p> */}
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
        </div>
      </section>
    </>
  );
};

export default Dashboard;
