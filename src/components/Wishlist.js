import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataAppContext } from "../DataContext";
import axios from "axios";
import DashboardRoutes from "./DashboardRoutes";
import Loader from './loader/Loader';
import loaderGif from "../assets/images/loader.gif"; 
const Wishlist = () => {
  const { isUserLoggedIn } = useContext(DataAppContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();
  const userid = localStorage.getItem('userid');
  const [loading, setLoading] = useState(false);

  const fetchWishlistItems = async () => {
    setLoading(true);
    const url = `${process.env.REACT_APP_API_URL}wishlist/usersWishlist/${userid}`;

    try {
      const response = await axios.get(url);
      setWishlistItems(response.data);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlistItems();
  }, [userid]);

  const handleCleanWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <>
      <section className="blog about-blog">
        <div className="container">
          {/* <div className="blog-bradcrum">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span className="devider">/</span>
            <span>
              <Link to="/wishlist">Wishlist</Link>
            </span>
          </div> */}
          {/* {loading && <Loader />} */}
          <div className="blog-heading about-heading">
            <h1 className="heading">User Wishlist</h1>
          </div>
        </div>
      </section>
      <section className="user-profile footer-padding">
        <div className="container">
          <div className="user-profile-section box-shadows">
            <div className="user-dashboard">
              <DashboardRoutes />
              <div>
              {loading ? (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    marginLeft: '300px',
                  }}>
                    <img src={loaderGif} alt="Loading..." style={{ width: '80px', height: '80px' }} />
                  </div>
                ) : 
                wishlistItems.length > 0 ? (
                  <section
                    className="cart product wishlist footer-padding"
                    data-aos="fade-up"
                  >
                    <div className="container">
                      <div className="cart-section wishlist-section">
                        <table>
                          <tbody>
                            <tr className="table-row table-top-row">
                              <td className="table-wrapper wrapper-product">
                                <h5 className="table-heading">PRODUCT</h5>
                              </td>
                              <td className="table-wrapper">
                                <div className="table-wrapper-center">
                                  <h5 className="table-heading">PRICE</h5>
                                </div>
                              </td>
                              <td className="table-wrapper">
                                <div className="table-wrapper-center">
                                  <h5 className="table-heading">ACTION</h5>
                                </div>
                              </td>
                            </tr>
                            {wishlistItems.map((item, index) => (
                              <tr key={index} className="table-row ticket-row">
                                <td className="table-wrapper wrapper-product">
                                  <div className="wrapper">
                                    <div className="wrapper-img">
                                      <img src={item.image} alt={item.prod_name} />
                                    </div>
                                    <div className="wrapper-content">
                                      <h5 className="heading">{item.prod_name}</h5> {/* Display product name */}
                                    </div>
                                  </div>
                                </td>
                                <td className="table-wrapper">
                                  <div className="table-wrapper-center">
                                    <h5 className="heading">Rs. {item.price}</h5> {/* Display product price */}
                                  </div>
                                </td>
                                <td className="table-wrapper">
                                  <div className="table-wrapper-center">
                                    <button>Move to Cart</button>
                                    <span>{/* Action icons or buttons */}</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="wishlist-btn">
                        <Link onClick={handleCleanWishlist} className="shop-btn shop-btn-red">
                          Clean Wishlist
                        </Link>
                      </div>
                    </div>
                  </section>
                ) : (
                  <div className="blog-item" data-aos="fade-up">
                    <div className="cart-img">
                      <img
                        src="assets/images/homepage-one/empty-cart.webp"
                        alt="Empty Cart"
                      />
                    </div>
                    <div className="cart-content">
                      <p>Items in wishlist: {wishlistItems.length}</p>
                      <p className="content-title">
                        Empty! You don’t have any products in your wishlist.
                      </p>
                      <Link to="/home" className="shop-btn">
                        Back to Shop
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Wishlist;
