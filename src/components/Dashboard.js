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
  const userid = localStorage.getItem('userid');

  const fetchDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}users/searchuser/${userid}`);
      setUserDetails({
        name: response.data[0].name,
        email: response.data[0].email,
        mobile: response.data[0].mobile
      });
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
