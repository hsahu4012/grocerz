import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { DataAppContext } from '../DataContext';
import axios from 'axios';

function Wishlist() {
  const { isUserLoggedIn, logout_User } = useContext(DataAppContext); 
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchWishlistItems = async () => {
      const url = `${process.env.REACT_APP_API_URL}wishlist/allWishlistItems`;
      // http://localhost:4000/wishlist/allWishlistItems
      try {
        if (isUserLoggedIn) {
          const response = await axios.get(url  );
          setWishlistItems(response.data);
        }
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      }
    };

    fetchWishlistItems();
  }, [isUserLoggedIn]);

  // const handleLogout = () => {
  //   logout_User(); 
  //   navigate('/login'); 
  // };

  return (
    <>
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="/"><i className="fa fa-home"></i> Home</Link>
                <span>Wishlist</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginLeft: '5rem', marginTop: '3rem', color: '#000', fontSize: '18px' }}>
        <p>Items in wishlist: {wishlistItems.length}</p>
       
      </div>

      
      <div className='row'>
        {wishlistItems.map(item => (
          <div className='col-3' key={item.id}>
            <div className="card" style={{ width: "18rem ", marginLeft: '5rem', marginRight: '3rem', marginTop: '2rem' }}>
              <button className="btn btn-light" style={{ position: 'absolute', top: '0', right: '0' }} ><i className='fa fa-times'></i></button>
              <img src={item.image} className="card-img-top" alt="Product" />
              <div className="card-body" style={{ textAlign: 'center' }}>
                <h5 className="rating"><Link to="#" >{item.name}</Link></h5>
                <div className="product__price">$ {item.price}</div>
                <li className="list-group-item">
                  <button type="button" className="btn btn-primary">
                    <Link to='/cart'><i className='fa fa-cart-plus' style={{ color: "#000" }}> Add to cart</i></Link>
                  </button>
                </li>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="col-3">
        <div className="card" style={{ width: "18rem", marginLeft: '5rem', marginRight: '3rem', marginTop: '10rem' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <h5 className="card-title"><Link to='/shop' className='btn btn-info'><i className="fa fa-shopping-basket"></i> Shop More</Link></h5>
          </div>
        </div>
      </div>
    </>
  );
}

export default Wishlist;
