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
  const [totalSpendings, setTotalSpendings] = useState(0);
  const [currentMonthSpendings, setCurrentMonthSpendings] = useState(0);
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

      const TotalSpendingResp = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getTotalExpenseByUserId/${userid}`
      );
      setTotalSpendings(TotalSpendingResp.data.totalExpense);

      const currentMonthSpendingResp = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/getCurrentMonthExpenseByUserId/${userid}`
      );
      setCurrentMonthSpendings(currentMonthSpendingResp.data.currentMonthSpendings);


    } catch (error) {
      console.error(error);
    }
  };

  const updateUserDetails = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}users/updateusersdashboard/${userid}`, {
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
                                <svg width={62} height={62}  viewBox="0 0 320 512" fill='none' xmlns='http://www.w3.org/2000/svg'>
                                  {/* <rect width={62} height={62} rx={4} fill='white' /> */}
                                  <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z"/>
                                </svg>
                              </span>
                            </div>
                            <div className='wrapper-content'>
                              <p className='paragraph'>Total Spendings</p>
                              <h3 className='heading'>{totalSpendings}</h3>
                            </div>
                          </div>
                        </div>
                        <div className='col-lg-4 col-sm-6'>
                          <div className='product-wrapper'>
                            <div className='wrapper-img'>
                              <span>
                                <svg width={62} height={62}  viewBox="0 0 320 512" fill='none' xmlns='http://www.w3.org/2000/svg'>
                                  {/* <rect width={62} height={62} rx={4} fill='white' /> */}
                                  {/* <rect width={62} height={62} rx={4} /> */}
                                  <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z"/>
                                </svg>
                              </span>
                            </div>
                            <div className='wrapper-content'>
                              <p className='paragraph'>Current Month Spendings</p>
                              <h3 className='heading'>{totalSpendings}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-lg-12 review-form'>
                            <div className="seller-info">
                              <h5 className="heading">Personal Information</h5>
                              {isEditing ? (
                        <div className='Edit-fields'>
                          <div className='checkout__form__input'>
                          <p>Name:</p><input type='text' name='name' value={userDetails.name} onChange={handleInputChange} className='form-control'/>
                          </div>
                          <div className='checkout__form__input'>
                          <p>Email: <input type="text" name="email" value={userDetails.email} onChange={handleInputChange} className='form-control'/></p>
                          </div>
                          <div className='checkout__form__input'>
                          <p>Phone: <input type="text" name="mobile" value={userDetails.mobile} onChange={handleInputChange} className='form-control'/></p>
                          </div>
                          <button type='submit' class='shop-btn' onClick={updateUserDetails}>Update</button>
                          <button type='submit' class='shop-btn-red' onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                        ) : (
                        <div>
                          <p>Name:  {userDetails.name}</p>
                          <p>Email:  {userDetails.email}</p>
                          <p>Phone:  {userDetails.mobile}</p>
                          <button type='submit' class='shop-btn' onClick={() => setIsEditing(true)}>Edit</button>
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
      </section>
    </>
  );
};


export default Dashboard;
