import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DataAppContext } from '../DataContext';
import axios from 'axios';
import DashboardRoutes from './DashboardRoutes';
import loaderGif from '../assets/images/loader.gif';

const Wishlist = () => {
  const { isUserLoggedIn } = useContext(DataAppContext);
  const { updateWishlistCount } = useContext(DataAppContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const userid = localStorage.getItem('userid');
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); 
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchWishlistItems = useCallback(async () => {
    setLoading(true);
    const url = `${process.env.REACT_APP_API_URL}wishlist/usersWishlist/${userid}`;

    try {
      const response = await axios.get(url);
      setWishlistItems(response.data);
      updateWishlistCount(response.data.length);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
    }
    setLoading(false);
  }, [userid, updateWishlistCount]);

  useEffect(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  const handleCleanWishlist = async () => {
    setModalAction('clean');
    setAlertModal(true);
  };

  const handleConfirmCleanWishlist = async () => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}wishlist/hardemptyWishList/${userid}`;
      
      await axios.delete(url); // hard delete
      
      setWishlistItems([]);
      updateWishlistCount(0);
    } catch (error) {
      console.error('Error cleaning wishlist:', error);
    } finally {
      setLoading(false);
      setAlertModal(false);
    }
  };

  const handleAddToCart = async productid => {
    try {
      setLoading(true);
      const addToCartUrl = `${process.env.REACT_APP_API_URL}cart/addToCart`;
      const removeFromWishlistUrl = `${process.env.REACT_APP_API_URL}wishlist/hardremoveFromWishlist/${userid}/${productid}`;

      await axios.post(addToCartUrl, { userid, productid, quantity: 1 });
      await axios.delete(removeFromWishlistUrl);

      setWishlistItems(prevItems =>
        prevItems.filter(item => item.productid !== productid)
      );
      updateWishlistCount(wishlistItems.length - 1);
    } catch (error) {
      console.error('Error adding to cart and removing from wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = productid => {
    setModalAction('remove');
    setSelectedProduct(productid);
    setAlertModal(true);
  };

  const handleConfirmRemoveFromWishlist = async () => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}wishlist/hardremoveFromWishlist/${userid}/${selectedProduct}`;

      await axios.delete(url);

      setWishlistItems(prevItems =>
        prevItems.filter(item => item.productid !== selectedProduct)
      );
      updateWishlistCount(wishlistItems.length - 1);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setLoading(false);
      setAlertModal(false);
    }
  };

  return (
    <>
      <section className='blog about-blog'>
        <div className='container'>
          <div className='blog-heading about-heading'>
            <h1 className='heading'>User Wishlist</h1>
          </div>
        </div>
      </section>
      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              <DashboardRoutes />
              <div>
                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', marginLeft: '300px' }}>
                    <img src={loaderGif} alt='Loading...' style={{ width: '80px', height: '80px' }} />
                  </div>
                ) : wishlistItems.length > 0 ? (
                  <section className='cart product wishlist footer-padding' data-aos='fade-up'>
                    <div className='container'>
                      <div className='cart-section wishlist-section'>
                        <table>
                          <tbody>
                            <tr className='table-row table-top-row'>
                              <td className='table-wrapper wrapper-product'>
                                <h5 className='table-heading'>PRODUCT</h5>
                              </td>
                              <td className='table-wrapper'>
                                <div className='table-wrapper-center'>
                                  <h5 className='table-heading'>PRICE</h5>
                                </div>
                              </td>
                              <td className='table-wrapper'>
                                <div className='table-wrapper-center'>
                                  <h5 className='table-heading'>ACTION</h5>
                                </div>
                              </td>
                            </tr>
                            {wishlistItems.map((item, index) => (
                              <tr key={index} className='table-row ticket-row'>
                                <td className='table-wrapper wrapper-product'>
                                  <div className='wrapper'>
                                    <div className='wrapper-img'>
                                      <img src={`${process.env.REACT_APP_API_URL}${item.image}`} alt={item.prod_name} />
                                    </div>
                                    <div className='wrapper-content'>
                                      <h5 className='heading'>{item.prod_name}</h5>
                                    </div>
                                  </div>
                                </td>
                                <td className='table-wrapper'>
                                  <div className='table-wrapper-center'>
                                    <h5 className='heading'>Rs. {item.price}</h5>
                                  </div>
                                </td>
                                <td className='table-wrapper'>
                                  <div className='table-wrapper-center flex flex-col items-center'>
                                    <button className='shop-btn text-xs px-2 py-1 m-2' onClick={() => handleAddToCart(item.productid)}>
                                      Move to Cart
                                    </button>
                                    <button className='shop-btn text-xs px-2 py-1' onClick={() => handleRemoveFromWishlist(item.productid)}>
                                      Remove from Wishlist
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className='wishlist-btn'>
                        <Link onClick={handleCleanWishlist} className='shop-btn'>
                          Clean Wishlist
                        </Link>
                      </div>
                    </div>
                  </section>
                ) : (
                  <div className='blog-item' data-aos='fade-up'>
                    <div className='cart-img'>
                      <img src='assets/images/homepage-one/empty-cart.webp' alt='Empty Cart' />
                    </div>
                    <div className='cart-content'>
                      <p>Items in wishlist: {wishlistItems.length}</p>
                      <p className='content-title'>Empty! You don’t have any products in your wishlist.</p>
                      <Link to='/home' className='shop-btn'>Back to Shop</Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {alertModal && (
        <div className='popup-overlay'>
          <div className='popup-content'>
            <h3>
              {modalAction === 'clean' ? 'Are you sure you want to permanently delete items from your wishlist?' : 'Are you sure you want to permanently remove item from your wishlist?'}
            </h3>
            <button onClick={() => setAlertModal(false)}>Cancel</button>
            <button onClick={modalAction === 'clean' ? handleConfirmCleanWishlist : handleConfirmRemoveFromWishlist}>
              {modalAction === 'clean' ? 'Clean Wishlist' : 'Remove Item'}
            </button>
            {loading && (
              <div className='spinner-overlay'>
                <p className='spinner2'></p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Wishlist;
