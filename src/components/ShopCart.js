import React, { useEffect, useId, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DataAppContext } from '../DataContext';
// import Loader from "./loader/Loader";
import loaderGif from '../assets/images/loader.gif';

const ShopCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const userid = localStorage.getItem('userid');
  const [loading, setLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const { updateCartCount } = useContext(DataAppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  useEffect(() => {
    fetchCartItems();
  }, [userid]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      if (userid) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}cart/userCart/${userid}`
        );
        const items = response.data;
        setCartItems(items);
        updateCartCount(response.data.length);
        const sortedItems = items
          .map(item => ({
            productid: item.productid,
            prod_name: item.prod_name,
            price: item.price,
            image: item.image,
            discount: item.discount,
            quantity: item.quantity,
          }))
          .sort((a, b) => {
            return a.prod_name.localeCompare(b.prod_name);
          });
        localStorage.setItem('cart', JSON.stringify(sortedItems));
        setLoading(false);
      } else {
        const storedCartItems =
          (localStorage.getItem('cart') &&
            JSON.parse(localStorage.getItem('cart'))) ||
          [];
        setCartItems([...storedCartItems]);
        updateCartCount(storedCartItems.length);
      }
    } catch (error) {
      console.error('Error fetching cart items', error);
    }
    setLoading(false);
  };

  const calculateTotal = () => {
    // console.log("totalling");
    let total = cartItems.reduce(
      (total, item) =>
        total +
        (Number(item.price) * item.quantity -
          Number(item.discount) * item.quantity),
      0
    );
    // console.log("total", total);
    setTotalCost(total);
  };

  const removeFromCart = async productid => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}cart/removeProduct/${userid}/${productid}`
      );
      setMessage(response.data.message || 'Removed from cart');
      setCartItems(prevItems =>
        prevItems.filter(item => item.productid !== productid)
      );
      updateCartCount(cartItems.length - 1);

      // Update localStorage as well
      const updatedCartItems = cartItems.filter(
        item => item.productid !== productid
      );
      localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    } catch (error) {
      setMessage('There was an error removing product from the cart!');
      console.error('Error removing from cart:', error);
    }
    setLoading(false);
  };

  const updateQuantity = async (productid, newQuantity) => {
    setLoading(false);
    try {
      if (userid) {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}cart/handleQuantity/${userid}/${productid}`,
          { quantity: newQuantity }
        );
        if (response.status === 200) {
          setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
              item.productid === productid
                ? { ...item, quantity: newQuantity }
                : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedItems));
            return updatedItems;
          });
        }
      } else {
        // Update cartItems locally if the user is not logged in
        setCartItems(prevItems => {
          const updatedItems = prevItems.map(item =>
            item.productid === productid
              ? { ...item, quantity: newQuantity }
              : item
          );
          localStorage.setItem('cart', JSON.stringify(updatedItems));
          return updatedItems;
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
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
  const clearCart = async () => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}cart/emptyCart/${userid}`;
      const response = await axios.put(url);
      if (response.status === 200) {
        setCartItems([]);
      } else {
        setMessage('There was an error clearing the cart!');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setMessage('There was an error clearing the cart!');
    }
    setLoading(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <section class='blog about-blog'>
        <div class='container'>
          {/* <div class="blog-bradcrum">
                <span><a href="/">Home</a></span>
                <span class="devider">/</span>
                <span><a href="#">Contact</a></span>
            </div> */}
          <div class='blog-heading about-heading'>
            <h1 class='heading'>Users Cart</h1>
          </div>
        </div>
      </section>
      

      {/* <section className='product-cart product footer-padding'>
        {loading && (
          <div className='loader-div'>
          <img className='loader-img'
            src={loaderGif}
            alt='Loading...'/>
        </div>
        )}
        </section> */}
      <section className='product-cart product footer-padding'>
        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <img
              src={loaderGif}
              alt='Loading...'
              style={{ width: '80px', height: '80px' }}
            />
          </div>
        )}

        {!loading && (
        <div className='container'>
          <div className='cart-section'>
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
                      <h5 className='table-heading'>QUANTITY</h5>
                    </div>
                  </td>
                  <td className='table-wrapper wrapper-total'>
                    <div className='table-wrapper-center'>
                      <h5 className='table-heading'>TOTAL</h5>
                    </div>
                  </td>
                  <td className='table-wrapper'>
                    <div className='table-wrapper-center'>
                      <h5 className='table-heading'>ACTION</h5>
                    </div>
                  </td>
                </tr>
                {(cartItems.length >0 && !loading)?(
                  <>
                  {cartItems.map(item => (
                  <tr className='table-row ticket-row' key={item.productid}>
                    <td className='table-wrapper wrapper-product'>
                      <div className='wrapper'>
                        <div className='wrapper-img'>
                          <img
                            src={`${process.env.REACT_APP_API_URL}${item.image}`}
                            alt='Product'
                          />
                        </div>
                        <div className='wrapper-content'>
                          {/* <h5 className="heading">{item.prod_name || 'Product Name - ' + item.productid}</h5> */}
                          <h5 className='heading'>
                            <Link
                              className='heading'
                              to={`/product/${item.productid}`}
                            >
                              {item.prod_name ||
                                'Product Name - ' + item.productid}
                            </Link>
                          </h5>
                        </div>
                      </div>
                    </td>
                    <td className='table-wrapper'>
                      <div className='table-wrapper-center'>
                        <h5 className='heading main-price'>
                          Rs. {item.price - Number(item.discount)}
                        </h5>
                      </div>
                    </td>
                    <td className='table-wrapper'>
                      <div className='table-wrapper-center'>
                        <div className='quantity'>
                          <span
                            className='minus'
                            onClick={() =>
                              decrementQuantity(item.productid, item.quantity)
                            }
                          >
                            -
                          </span>
                          <span className='number'>{item.quantity}</span>
                          <span
                            className='plus'
                            onClick={() =>
                              incrementQuantity(item.productid, item.quantity)
                            }
                          >
                            +
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className='table-wrapper wrapper-total'>
                      <div className='table-wrapper-center'>
                        <h5 className='heading total-price'>
                          Rs.{' '}
                          {item.price * item.quantity -
                            Number(item.discount) * item.quantity}
                        </h5>
                      </div>
                    </td>
                    <td className='table-wrapper'>
                      <div
                        className=' wishlist-btn cart-btn'
                        onClick={() => removeFromCart(item.productid)}
                      >
                        <button onClick={() => removeFromCart} className='shop-btn remove' >Remove Now</button>
                        <div>
                          <Link to='/checkout' className='shop-btn'>
                            Buy Now
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                  </>
                ):(
                  <></>
                )}
              </tbody>
            </table>
          </div>
          {cartItems.length===0 && !loading && <div className='container d-flex flex-column justify-content-center align-items-center'>
              <img  src="assets/images/homepage-one/empty-cart.webp" width={400} height={400} alt="" />
              <h3 className='p-3'>Cart is Empty</h3>
            </div>
            {localStorage.getItem('usertype') === 'admin' && cartItems.length === 0 && (
              <div className = 'cart-section'> 
                <img className='rounded mx-auto d-block'
                src='../../assets/images/homepage-one/empty-cart.webp' 
                /> 
                <h4 className='text-center'>Cart is Empty</h4>    
              </div>
              )
            }
              <div className='wishlist-btn cart-btn'>
                <button
                className='clean-btn shop-btn'
                onClick={() => setIsModalOpen(true)}
              >
                  Clear Cart
                </button>
                <button className='shop-btn'>Total - {totalCost}</button>
                {/* <Link to="#" className="shop-btn update-btn">Update Cart</Link> */}
                <Link to='/checkout' className='shop-btn'>
                  Proceed to Checkout
                </Link>
              </div>
            {message && <p>{message}</p>}
          </div>
        )}
        

          <div>
            {/* <div className="col-lg-6 col-md-6 col-sm-6">
          <div className="cart__btn update__btn">
            <Link to="#">
              <span className="icon_loading" /> Update cart
            </Link>
          </div>
        </div> */}
        </div>
        {/* </div> */}

        {/* <div class="row">
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
      {isModalOpen && (
        <div className='popup-overlay'>
          <div className='popup-content'>
            <h3>Are you sure you want to delete all items from your cart?</h3>
            <button onClick={clearCart}>Yes, Clear Cart</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
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

export default ShopCart;
