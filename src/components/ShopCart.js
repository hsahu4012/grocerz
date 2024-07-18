import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import dress1 from '../assets/img/product/women/dress1.jpg';

const ShopCart = () => {

  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const userid = localStorage.getItem('userid');

  useEffect(() => {
    fetchCartItems();
  }, [userid]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}cart/userCart/${userid}`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const removeFromCart = async (productid) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}cart/removeProduct/${userid}/${productid}`);
        setMessage(response.data.message || 'Removed from cart');
        setCartItems(prevItems => prevItems.filter(item => item.productid !== productid));
      }catch (error) {
      setMessage('There was an error removing product from the cart!');
      console.error('Error removing to cart:', error);
    }
  };

  const updateQuantity = async (productid, newQuantity) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}cart/handleQuantity/${userid}/${productid}`, { quantity: newQuantity });
      if (response.status === 200) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.productid === productid ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        console.error('Failed to update quantity', response.data);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
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

  const addToCart = async (productid, quantity = 1) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}cart/addToCart`, { userid, productid, quantity });
      if (response.status === 200) {
        setMessage(response.data.message);
        fetchCartItems();
      } else {
        setMessage('Failed to add item to cart!');
      }
    } catch (error) {
      setMessage('There was an error adding product to the cart!');
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <>
      <div>
        <div className="offcanvas-menu-overlay" />
        <div className="offcanvas-menu-wrapper">
          <div className="offcanvas__close">+</div>
          <ul className="offcanvas__widget">
            <li>
              <span className="icon_search search-switch" />
            </li>
            <li>
              <Link to="#">
                <span className="icon_heart_alt" />
                <div className="tip">2</div>
              </Link>
            </li>
            <li>
              <Link to="#">
                <span className="icon_bag_alt" />
                <div className="tip">2</div>
              </Link>
            </li>
          </ul>
          <div className="offcanvas__logo">
            <Link to="index-2.html">
              <img className="cart-logo" src="img/logo.png" alt="" />
            </Link>
          </div>
          <div id="mobile-menu-wrap" />
          <div className="offcanvas__auth">
            <Link to="#">Login</Link>
            <Link to="#">Register</Link>
          </div>
        </div>
      </div>

      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="index-2.html">
                  <i className="fa fa-home" /> Home
                </Link>
                <span>Shopping cart</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="shop-cart spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="shop__cart__table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.productid}>
                        <td className="cart__product__item">
                          <img className="cart-img" src={dress1 || item.image} alt={item.name} />
                          <div className="cart__product__item__title">
                            <h6>{item.prod_name || 'Product Name - ' + item.productid}</h6>
                          </div>
                        </td>
                        <td className="cart__price">Rs. {item.price}</td>
                        <td className="cart__quantity">
                          <div className="pro-qty">
                            <span className="dec qtybtn" onClick={() => decrementQuantity(item.productid, item.quantity)}>-</span>
                            <input type="text" value={item.quantity} readOnly />
                            <span className="inc qtybtn" onClick={() => incrementQuantity(item.productid, item.quantity)}>+</span>
                          </div>
                        </td>
                        <td className="cart__total">Rs. {item.price * item.quantity}</td>
                        <td className="cart__close" onClick={() => removeFromCart(item.productid)}>
                          <span className="icon_close" />
                          Remove
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="cart__product__item">

                        <div className="cart__product__item__title">
                          <h6>Cart Total</h6>
                        </div>
                      </td>
                      <td className="cart__price">-</td>
                      <td className="cart__quantity">
                        &nbsp;
                        </td>
                      <td className="cart__total">Rs. {calculateTotal()}</td>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="cart__btn">
                <Link to="/home">Continue Shopping</Link>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
            <Link to="/checkout" className="primary-btn">
                  Proceed to Checkout
                </Link>
            </div>
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


        </div>
      </section>
    </>
  );
};

export default ShopCart;