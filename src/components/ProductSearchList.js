import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import temp_product_image from '../assets/products/p-img-29.webp';
import Loader from './loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
const ProductSearchList = () => {
  const location = useLocation();
  const [searchedProducts, setSearchProducts] = useState([]);
  const [message, setMessage] = useState('');
  const userid = localStorage.getItem('userid');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [orderIDs, setOrderIDs] = useState([]);
  const [selectedorderIDs, setselectedOrderIDs] = useState();
  const [singleProduct, setSingleProduct] = useState();
  const usertype = localStorage.getItem('usertype');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch the cart from local storage when the component mounts
    const storedCart =
      (localStorage.getItem('cart') &&
        JSON.parse(localStorage.getItem('cart'))) ||
      [];
    setCart(storedCart);
  }, []);

  const query = new URLSearchParams(location.search);
  useEffect(() => {
    fetchSearchedProducts();
  }, [query.get('q')]);

  const fetchSearchedProducts = async categoryId => {
    setLoading(true);
    try {
      const searchTerm = query.get('q');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}products/search?q=${encodeURIComponent(searchTerm)}`
      );
      setSearchProducts(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
    setLoading(false);
  };

  const handleAddToCart = async product => {
    setLoading(true);
    const { productid, prod_name, price, image, discount } = product;
    try {
      const quantity = 1;
      if (userid) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}cart/addToCart`,
          {
            userid,
            productid,
            quantity,
          }
        );
        if (response.status === 200) {
          let cart = localStorage.getItem('cart').length
            ? JSON.parse(localStorage.getItem('cart'))
            : [];
          cart.push({ productid, prod_name, price, image, discount, quantity });
          localStorage.setItem('cart', JSON.stringify(cart));
          toast.success('Product added to cart successfully');
        } else {
          toast.error('Failed to add product to cart');
        }
      } else {
        let cart = localStorage.getItem('cart').length
          ? JSON.parse(localStorage.getItem('cart'))
          : [];
        const existingProduct = cart.find(item => item.productid === productid);
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.push({ productid, prod_name, price, image, discount, quantity });
        }
        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success('Product added to cart successfully');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    setLoading(false);
  };

  const addToWishlist = async productid => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}wishlist/addToWishlist`,
        {
          userid,
          productid,
        }
      );
      // setMessage(response.data.message || 'Added to wishlist');
      if (response.status === 200) {
        toast.success('Product added to wishlist successfully');
      } else {
        toast.error('Failed to add product to cart');
      }
    } catch (error) {
      setMessage('There was an error adding the product to the wishlist!');
      console.error('Error adding to wishlist:', error);
    }
    setLoading(false);
  };
  const fetchOrderIDs = async () => {
    setLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + 'orders/allorderIDs';
      const response = await axios.get(url);
      // console.log('orderIds response:', response.data);
      setOrderIDs(response.data);
    } catch (error) {
      console.error('Error fetching orderIDs:', error);
    }
    setLoading(false);
  };
  const handleAddProduct = async productid => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}orderdetails/addProductInToOrder/${selectedorderIDs}`;
      await axios.post(url, singleProduct);
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding product to order:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderIDs();
  }, [showPopup]);

  const connectwhatsapp = () => {
    const phoneNumber = '+918757499345';
    const message = `Hi. I want to place an order.`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank').focus();
  };
  const isInCart = productid => {
    return cart.some(item => item.productid === productid);
  };
  return (
    <>
      <ToastContainer />
      <section className='shop spad product product-sidebar footer-padding'>
        <div className='container'>
          {loading && <Loader />}
          <div className='col-lg-12 col-md-12 mx-auto'>
            <div className='row g-4'>
              {' '}
              {/* Added g-4 class for gutter spacing */}
              {searchedProducts.length > 0 ? (
                searchedProducts.map(product => (
                  <div
                    className='col-lg-3 col-md-4 col-sm-6'
                    key={product.productid}
                  >
                    <div className='product-wrapper' data-aos='fade-up'>
                      <Link to={`/product/${product.productid}`}>
                        <div className='product-img'>
                          <img
                            src={
                              product.image
                                ? `${process.env.REACT_APP_IMAGE_URL}${product.image}`
                                : temp_product_image
                            }
                            alt={product.prod_name}
                          />
                        </div>
                      </Link>
                      <div className='product-info'>
                        <div className='product-description'>
                          <div className='product-details'>
                            {product.prod_name}
                          </div>
                          <div className='price'>
                            {product.discount !== 0 && (
                              <span className='price-cut'>
                                &#8377; &nbsp;{product.price}
                              </span>
                            )}
                            <span className='new-price'>
                              &#8377; &nbsp;{product.price - product.discount}
                            </span>
                          </div>
                        </div>
                        {product.stock_quantity < 1 && (
                          <p className='out-of-stock'>Out of Stock</p>
                        )}
                        {product.stock_quantity > 0 && (
                          <div className='product-cart-btn'>
                            {isInCart(product.productid) ? (
                              <Link
                                to={'/cart'}
                                className='product-btn mb-2'
                                type='button'
                              >
                                Go to Cart
                              </Link>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className='product-btn mb-2'
                                type='button'
                              >
                                Add to Cart
                              </button>
                            )}
                            {userid && (
                              <button
                                onClick={() => addToWishlist(product.productid)}
                                className='product-btn'
                                type='button'
                              >
                                Add to Wishlist
                              </button>
                            )}
                            {usertype === 'admin' && (
                              <button
                                className='product-btn mt-2'
                                type='button'
                                onClick={() => {
                                  setShowPopup(true);
                                  setSingleProduct(product);
                                }}
                              >
                                Add to Orders
                              </button>
                            )}
                            {showPopup && (
                              <div className='popup-overlay'>
                                <div className='popup-content'>
                                  <h3>Select Order ID</h3>
                                  <select
                                    value={selectedorderIDs}
                                    onChange={e =>
                                      setselectedOrderIDs(e.target.value)
                                    }
                                  >
                                    <option value=''>Select Order ID</option>
                                    {orderIDs.map(oid => (
                                      <option
                                        key={oid.order_id}
                                        value={oid.order_id}
                                      >
                                        {oid.srno} - {oid.order_id}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    className=''
                                    onClick={handleAddProduct}
                                  >
                                    Add Product
                                  </button>
                                  <button onClick={() => setShowPopup(false)}>
                                    Close
                                  </button>
                                  {/* {loading && <div className='spinner-overlay'><p className='spinner2'></p></div>} */}
                                  {/* {err && <p className=''>{err}</p>} */}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='col-lg-12'>
                  <p>No any product available!</p>
                </div>
              )}
            </div>
          </div>

          <div class='login-btn'>
            <button onClick={connectwhatsapp} class='shop-btn shop-btn-full'>
              If your product is not listed<br></br>Order on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {message && (
        <div className='message'>
          <p>{message}</p>
        </div>
      )}
    </>
  );
};

export default ProductSearchList;
