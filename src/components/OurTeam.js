import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const OurTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}ourteam/allourteam`;
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
            <span>Our Team</span>
          </div>
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Meet Our Team</h1>
          </div>
        </div>
      </section>

      <ToastContainer />

      <div className='container'>
          <div className='row d-flex flex-wrap'>
            {teamMembers.length > 0 ? (
              teamMembers.map(member => (
                <div
                  className='col-lg-3 col-md-4 col-sm-6 mb-4 d-flex align-items-stretch'
                  key={member.id}
                >
                  <div
                    className='product-wrapper m-2 w-100 d-flex flex-column'
                    data-aos='fade-up'
                  >
                    <Link to={`/team/${member.id}`}>
                      <div className='product-img'>
                        <img
                          src={
                            member.image
                              ? `${process.env.REACT_APP_IMAGE_URL}${member.image}`
                              : 'default-image.jpg'
                          }
                          alt={member.name}
                        />
                      </div>
                    </Link>
                    <div className='product-info flex-grow-1'>
                      <div className='product-description'>
                        <div className='product-details'>{member.name}</div>
                        <div className='price'>
                          <span className='designation text-success'>
                            Designation: {member.designation}
                          </span>
                        </div>
                        <div className='price'>
                          <span className='designation text-success'>
                            Department: {member.department}
                          </span>
                        </div>
                        <p className='description'>{member.description}</p>
                      </div>
                      <div className='product-cart-btn'>
                        <button
                          onClick={() => handleViewDetails(member)}
                          className='product-btn'
                          type='button'
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No team members found.</p>
            )}
          </div>
      </div>

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

export default OurTeam;
