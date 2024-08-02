import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataAppContext } from "../DataContext";
import axios from "axios";
import DashboardRoutes from "./DashboardRoutes";

function Wishlist() {
  const { isUserLoggedIn } = useContext(DataAppContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  // for testing / development purpose

  // const dummyData = [
  //   {
  //     id: 1,
  //     name: "KOSPET TANK T1 MIL-STD Waterproof Smartwatch",
  //     price: 20.0,
  //     image: "assets/images/homepage-one/product-img/p-img-5.webp",
  //   },
  //   {
  //     id: 2,
  //     name: "Fresh Mashroom",
  //     price: 20.0,
  //     image: "assets/images/homepage-one/product-img/p-img-6.webp",
  //   },
  //   {
  //     id: 3,
  //     name: "Fresh Baked Bread",
  //     price: 20.0,
  //     image: "assets/images/homepage-one/product-img/p-img-7.webp",
  //   },
  //   {
  //     id: 4,
  //     name: "Fresh Bananas",
  //     price: 20.0,
  //     image: "assets/images/homepage-one/product-img/p-img-8.webp",
  //   },
  // ];
  useEffect(() => {
    const fetchWishlistItems = async () => {
      const url = `${process.env.REACT_APP_API_URL}wishlist/allWishlistItems`;

      if (isUserLoggedIn) {
        try {
          const response = await axios.get(url);
          setWishlistItems(response.data);
        } catch (error) {
          console.error("Error fetching wishlist items:", error);
          if (process.env.NODE_ENV === "development") {
            //setWishlistItems(dummyData);
          }
        }
      } else if (process.env.NODE_ENV === "development") {
        //setWishlistItems(dummyData);
      }
    };
    fetchWishlistItems();
  }, [isUserLoggedIn]);

  // for production if you want to live the app

  // useEffect(() => {
  //   const fetchWishlistItems = async () => {
  //     const url = `${process.env.REACT_APP_API_URL}wishlist/allWishlistItems`;
  //     if (isUserLoggedIn) {
  //       try {
  //         const response = await axios.get(url);
  //         setWishlistItems(response.data);
  //       } catch (error) {
  //         console.error("Error fetching wishlist items:", error);
  //       }
  //     }
  //   };
  //   fetchWishlistItems();
  // }, [isUserLoggedIn]);

  const handleCleanWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <>
      <section className="blog about-blog">
        <div className="container">
          <div className="blog-bradcrum">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span className="devider">/</span>
            <span>
              <Link to="/wishlist">Wishlist</Link>
            </span>
          </div>
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
                                      <h5 className="heading">{item.name}</h5>
                                    </div>
                                  </div>
                                </td>
                                <td className="table-wrapper">
                                  <div className="table-wrapper-center">
                                    <h5 className="heading">${item.price}</h5>
                                  </div>
                                </td>
                                <td className="table-wrapper">
                                  <div className="table-wrapper-center">
                                    <span>{/* Action icons or buttons */}</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="wishlist-btn">
                        <Link
                          to="#"
                          onClick={handleCleanWishlist}
                          className="clean-btn"
                        >
                          Clean Wishlist
                        </Link>
                        <Link to="/cart" className="shop-btn">
                          View Cards
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
                      <Link to="/" className="shop-btn">
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
}

export default Wishlist;
