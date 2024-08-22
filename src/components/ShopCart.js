import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dress1 from "../assets/img/product/women/dress1.jpg";
import Loader from "./loader/Loader";

const ShopCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemsUI, setCartItemsUI] = useState([]);
  const [message, setMessage] = useState("");
  const userid = localStorage.getItem("userid");
  const [loading, setLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  useEffect(() => {
    fetchCartItems();
  }, [userid]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      // Retrieve cart items from localStorage
      const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];

      // Fetch product details for each item in the cart
      const productDetailsPromises = storedCartItems.map(async (item) => {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}products/productByPId/${item.productid}`
        );
        return {
          ...item,
          ...response.data, // Merge the product details with the cart item
        };
      });

      const updatedCartItems = await Promise.all(productDetailsPromises);
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
    setLoading(false);
  };

  const calculateTotal = () => {
    console.log("totalling");
    let total = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    console.log("total", total);
    setTotalCost(total);
  };

  const removeFromCart = async (productid) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}cart/removeProduct/${userid}/${productid}`
      );
      setMessage(response.data.message || "Removed from cart");
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productid !== productid)
      );
      // Update localStorage as well
      const updatedCartItems = cartItems.filter((item) => item.productid !== productid);
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    } catch (error) {
      setMessage("There was an error removing product from the cart!");
      console.error("Error removing from cart:", error);
    }
    setLoading(false);
  };

  const updateQuantity = async (productid, newQuantity) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}cart/handleQuantity/${userid}/${productid}`,
        { quantity: newQuantity }
      );
      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productid === productid
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        // Update localStorage as well
        const updatedCartItems = cartItems.map((item) =>
          item.productid === productid
            ? { ...item, quantity: newQuantity }
            : item
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      } else {
        console.error("Failed to update quantity", response.data);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
    setLoading(false);
  };

  const incrementQuantity = (productid, currentQuantity) => {
    updateQuantity(productid, currentQuantity + 1);
  };

  const decrementQuantity = (productid, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(productid, currentQuantity - 1);
    } else {
      removeFromCart(productid);
    }
  };
  return (
    <section className="product-cart product footer-padding">
      {loading && <Loader />}
      <div className="container">
        <div className="cart-section">
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
                    <h5 className="table-heading">QUANTITY</h5>
                  </div>
                </td>
                <td className="table-wrapper wrapper-total">
                  <div className="table-wrapper-center">
                    <h5 className="table-heading">TOTAL</h5>
                  </div>
                </td>
                <td className="table-wrapper">
                  <div className="table-wrapper-center">
                    <h5 className="table-heading">ACTION</h5>
                  </div>
                </td>
              </tr>
              {cartItems.map((item) => (
                <tr className="table-row ticket-row" key={item.productid}>
                  <td className="table-wrapper wrapper-product">
                    <div className="wrapper">
                      <div className="wrapper-img">
                        <img src={item.image || dress1} alt="Product" />
                      </div>
                      <div className="wrapper-content">
                        {/* <h5 className="heading">{item.prod_name || 'Product Name - ' + item.productid}</h5> */}
                        <h5 className="heading">
                          <Link
                            className="heading"
                            to={`/product/${item.productid}`}
                          >
                            {item.prod_name ||
                              "Product Name - " + item.productid}
                          </Link>
                        </h5>
                      </div>
                    </div>
                  </td>
                  <td className="table-wrapper">
                    <div className="table-wrapper-center">
                      <h5 className="heading main-price">Rs. {item.price}</h5>
                    </div>
                  </td>
                  <td className="table-wrapper">
                    <div className="table-wrapper-center">
                      <div className="quantity">
                        <span
                          className="minus"
                          onClick={() =>
                            decrementQuantity(item.productid, item.quantity)
                          }
                        >
                          -
                        </span>
                        <span className="number">{item.quantity}</span>
                        <span
                          className="plus"
                          onClick={() =>
                            incrementQuantity(item.productid, item.quantity)
                          }
                        >
                          +
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="table-wrapper wrapper-total">
                    <div className="table-wrapper-center">
                      <h5 className="heading total-price">
                        Rs. {item.price * item.quantity}
                      </h5>
                    </div>
                  </td>
                  <td className="table-wrapper">
                    <div
                      className="table-wrapper-center"
                      onClick={() => removeFromCart(item.productid)}
                    >
                      <span>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.7 0.3C9.3 -0.1 8.7 -0.1 8.3 0.3L5 3.6L1.7 0.3C1.3 -0.1 0.7 -0.1 0.3 0.3C-0.1 0.7 -0.1 1.3 0.3 1.7L3.6 5L0.3 8.3C-0.1 8.7 -0.1 9.3 0.3 9.7C0.7 10.1 1.3 10.1 1.7 9.7L5 6.4L8.3 9.7C8.7 10.1 9.3 10.1 9.7 9.7C10.1 9.3 10.1 8.7 9.7 8.3L6.4 5L9.7 1.7C10.1 1.3 10.1 0.7 9.7 0.3Z"
                            fill="#AAAAAA"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="wishlist-btn cart-btn">
          <button
            className="clean-btn shop-btn"
            onClick={() => setCartItems([])}
          >
            Clear Cart
          </button>
          <button className="shop-btn">Total - {totalCost}</button>
          {/* <Link to="#" className="shop-btn update-btn">Update Cart</Link> */}
          <Link to="/checkout" className="shop-btn">
            Proceed to Checkout
          </Link>
        </div>
        {message && <p>{message}</p>}
      </div>

      <div>
        {/* <div className="col-lg-6 col-md-6 col-sm-6">
          <div className="cart__btn update__btn">
            <Link to="#">
              <span className="icon_loading" /> Update cart
            </Link>
          </div>
        </div> */}
      </div>

      {/* <div class="row">
        <div class="col-lg-6">
          <div class="discount__content">
            <h6>Discount codes</h6>
            <form action="#">
              <input type="text" placeholder="Enter your coupon code" />
              <button type="submit" class="site-btn">Apply</button>
            </form>
          </div>
        </div>
        <div class="col-lg-4 offset-lg-2">
          <div class="cart__total__procced">
            <h6>Cart total</h6>
            <ul>
              <li>Subtotal <span>$ 750.0</span></li>
              <li>Total <span>Rs. {total || 123123}</span></li>
            </ul>
            <Link to="/checkout" className="primary-btn">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default ShopCart;
