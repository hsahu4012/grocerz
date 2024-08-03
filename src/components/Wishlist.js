import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataAppContext } from "../DataContext";
import axios from "axios";
import DashboardRoutes from "./DashboardRoutes";

const Wishlist = () => {

  const { isUserLoggedIn } = useContext(DataAppContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();
  const userid = localStorage.getItem('userid');

  const fetchWishlistItems = async () => {
    const url = `${process.env.REACT_APP_API_URL}wishlist/allWishlistItems`;

    try {
      const response = await axios.get(url);
      setWishlistItems(response.data);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);

    };
  }

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
                {wishlistItems.length > 0 ? (
                  <section
                    className="cart product wishlist footer-padding"
                    data-aos="fade-up"
                  >
                    <div className="container">
                      <div className="cart-section wishlist-section">
                        <table>
                          <tbody>
                            {wishlistItems.map((item, index) => (
                              <tr key={index} className="table-row ticket-row">
                                <td className="table-wrapper wrapper-product">
                                  <div className="wrapper">
                                    <div className="wrapper-img">
                                      <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="wrapper-content">
                                      <h5 className="heading">{item.productid}</h5>
                                    </div>
                                  </div>
                                </td>
                                <td className="table-wrapper">
                                  <div className="table-wrapper-center">
                                    <h5 className="heading">Rs. {item.price}</h5>
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
