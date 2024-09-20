import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AddressListData = () => {
  const userid = localStorage.getItem('userid');
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}address/getByuserId/${userid}`
      );
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

<<<<<<< HEAD
    useEffect(() => {
        fetchAddresses()
    }, [])

    return (
        <>

            <div className="container">
               
                <div className="row">
    
                    {/* <div className="col-lg-12">
=======
  return (
    <>
      <div className='container'>
        <h5>Saved Addresses</h5>
        <div className='row address-section'>
          {/* <div className="col-lg-12">
>>>>>>> d678f0397f2cee168da222e87a91e5ba81fecfb7

                        <Link to="/address" class="site-btn" >Add a new address</Link>

                    </div> */}

<<<<<<< HEAD
                   <div className="col-lg-12 container">
                    <h5>Saved Addresses</h5>
                    <div className='row card-deck '>
                    {
                        addresses.map((item) => (
                            
                                <div class="services__item bg-secondary bg-opacity-10 mb-3 rounded-4 p-4  card" style={{maxWidth:'450px', marginLeft:'25px'}}>
                                    <i class="fa fa-car"></i>
                                    <h5>Name - {item.name}</h5>
                                    <p>{item.line1}&nbsp;{item.line2}&nbsp;{item.line3}</p>
                                    <p>{item.city}&nbsp;{item.state}&nbsp;{item.country}</p>
                                    <p>{item.pin}</p>
                                    <p>Mobile - {item.contact}&nbsp;{item.alternatecontact}</p>
                                    <p>Landmark - {item.landmark}</p>
                                </div>
                           
                        ))
                    }
                    </div>

                </div>
            </div>
        </div>

    </>
    )
}

export default AddressListData
=======
          {addresses.map((address, index) => (
            <>
              <div className='col-lg-6'>
                <div class='services__item bg-secondary bg-opacity-10 mb-3 seller-info'>
                  {/* <i class="fa fa-car"></i> */}
                  <h4 className='heading-custom-font-1'>
                    Address - {index + 1}
                  </h4>
                  <p>Name - {address.name}</p>
                  <p>Address - {address.line1}</p>
                  <p>
                    City - {address.city}, {address.state}, {address.country},{' '}
                    {address.pin},
                  </p>
                  <p>Landmark - {address.landmark}</p>
                  <p>
                    Contact - {address.contact}&nbsp;&nbsp;{' '}
                    {address.alternatecontact}
                  </p>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddressListData;
>>>>>>> d678f0397f2cee168da222e87a91e5ba81fecfb7
