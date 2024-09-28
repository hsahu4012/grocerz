import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const Offers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}discount/alloffers`;
        const response = await axios.get(url);
        setTeamMembers(response.data);
      } catch (error) {
        toast.error('Error fetching team members.');
        console.error(error);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleViewDetails = member => {
    setSelectedMember(member);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedMember(null);
  };

  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          <div className='blog-bradcrum'>
            <span>
              <a href='/home'>Home</a>
            </span>
            <span className='devider'>/</span>
            <span>Discounts & Offers</span>
          </div>
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Discounts & Offers</h1>
          </div>
        </div>
      </section>

      <ToastContainer />

      <div className='container'>
        {/* Render design if only one discount is available */}
        {teamMembers.length === 1 &&
          teamMembers.map(member => (
            <div className='d-flex justify-content-center' key={member.id}>
              <div
                className='d-flex flex-column align-items-center p-4'
                style={{
                  backgroundImage: 'url("../src/assets/images/discount.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '8px',
                  maxWidth: '400px',
                  textAlign: 'center',
                }}
              >
                <div className='text-center mb-3'>
                  {member.image && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}${member.image}`}
                      alt={member.discountname}
                      width='120'
                      className='img-fluid'
                    />
                  )}
                </div>
                <h2>{member.discountname}</h2>
                <p>
                  PROMOCODE: {member.discountid}
                  <br />
                  {member.amount > 0 && `Fixed Discount: ₹${member.amount}`}
                  <br />
                  {member.percentage > 0 &&
                    `Percentage Discount: ${member.percentage}%`}
                  <br />
                  Valid Till: {member.enddate.substring(8, 10)}/
                  {member.enddate.substring(5, 7)}/
                  {member.enddate.substring(0, 4)}
                </p>
                <a
                  href='/product-sidebar.html'
                  className='btn btn-warning mt-4'
                >
                  Shop Now
                </a>
              </div>
            </div>
          ))}

        {/* Render design if two discounts are available */}
        {teamMembers.length === 2 && (
          <div className='row justify-content-center'>
            {teamMembers.map((member, index) => (
              <div
                className='col-md-5 d-flex justify-content-center mb-5 mt-5'
                key={member.id}
              >
                <div
                  className='d-flex flex-column align-items-center p-4'
                  style={{
                    backgroundColor:
                      index === 0
                        ? 'rgba(240, 146, 159, 0.28)'
                        : 'rgba(104, 199, 236, 0.28)', // Different colors for each container
                    border: '1px solid rgba(0, 0, 0, 0.1)', // Light border for contrast
                    borderRadius: '8px',
                    textAlign: 'center',
                    width: '100%',
                    minHeight: '300px', // Ensures both containers have the same height
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Light shadow for depth
                  }}
                >
                  <div className='text-center mb-3'>
                    {member.image && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${member.image}`}
                        alt={member.discountname}
                        width='120'
                        className='img-fluid'
                      />
                    )}
                  </div>
                  <h2>{member.discountname}</h2>
                  <p>
                    PROMOCODE: {member.discountid}
                    <br />
                    {member.amount > 0 && `Fixed Discount: ₹${member.amount}`}
                    <br />
                    {member.percentage > 0 &&
                      `Percentage Discount: ${member.percentage}%`}
                    <br />
                    Valid Till: {member.enddate.substring(8, 10)}/
                    {member.enddate.substring(5, 7)}/
                    {member.enddate.substring(0, 4)}
                  </p>
                  <div className='product-cart-btn'>
                    <button
                      onClick={() => handleViewDetails(member)}
                      className='product-btn btn btn-warning mt-4' // Applied Bootstrap styling for consistency
                      type='button'
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback if no discounts are available */}
        {teamMembers.length === 0 && (
          <div className='my-5 text-center'>
            <p>No Active Offers</p>
          </div>
        )}
      </div>

      {/* Popup for view details */}
      {showPopup && selectedMember && (
        <div className='popup-overlay'>
          <div className='popup-content'>
            <h3>{selectedMember.name}</h3>
            <p>Designation: {selectedMember.designation}</p>
            <p>Department: {selectedMember.department}</p>
            <p>Description: {selectedMember.description}</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Offers;
