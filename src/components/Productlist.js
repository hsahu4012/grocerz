import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import temp_product_image from '../assets/products/p-img-29.webp';
import Loader from './loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import Discount from './shared/Discount_tag';
const Productlist = () => {
  const { category_id } = useParams();
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [message, setMessage] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
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

  useEffect(() => {
    if (category_id) {
      fetchSubcategories(category_id);
    }
  }, [category_id]);

  const storeSelectedSubcategory = firstSubcategoryId => {
    // console.log('setting sub category id')
    setSelectedSubcategory(firstSubcategoryId);
    window.localStorage.setItem('selectedSubcategory', firstSubcategoryId);
  };

  const fetchSubcategories = async categoryId => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}subCategory/categoryid/${categoryId}`
      );
      console.log('Subcategories response:', response.data);
      setSubcategories(response.data);
      if (response.data.length > 0) {
        let subcategories = response.data.map(item => item.subcategory_id);
        let storedsubcategory = window.localStorage.getItem(
          'selectedSubcategory'
        );
        //console.log('subcategories', subcategories)
        //console.log('storedsubcategory', storedsubcategory)
        if (subcategories.indexOf(storedsubcategory) > -1) {
          //console.log('inside if', storedsubcategory)
          storeSelectedSubcategory(storedsubcategory);
          fetchProducts(categoryId, storedsubcategory);
          //setSubcategoryName(response.data[0].subcategoryname);
        } else {
          //console.log('inside else')
          const firstSubcategoryId = response.data[0].subcategory_id;
          storeSelectedSubcategory(firstSubcategoryId);
          fetchProducts(categoryId, firstSubcategoryId);
          //setSubcategoryName(response.data[0].subcategoryname);
        }
        // const firstSubcategoryId = response.data[0].subcategory_id;
        // storeSelectedSubcategory(firstSubcategoryId);
        // fetchProducts(categoryId, firstSubcategoryId);
        //setSubcategoryName(response.data[0].subcategoryname);
      } else {
        setProducts([]);
        //setSubcategoryName('');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
    setLoading(false);
  };

  const fetchProducts = async (categoryId, subcategoryId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}products/bySubCategory`,
        {
          category: categoryId,
          subcategory: subcategoryId,
        }
      );
      // console.log('Products response:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
  useEffect(() => {
    if (selectedSubcategory) {
      fetchProducts(category_id, selectedSubcategory);
    }
  }, [selectedSubcategory]);

  useEffect(() => {
    setSelectedSubcategory(window.localStorage.getItem('selectedSubcategory'));
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchOrderIDs();
  }, [showPopup]);

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
        let cart = localStorage.getItem('cart')
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
      if (response.status === 200) {
        toast.success('Product added to wishlist successfully');
      } else {
        toast.error('Failed to add product to cart');
      }
      // setMessage(response.data.message || 'Added to wishlist');
    } catch (error) {
      setMessage('There was an error adding the product to the wishlist!');
      console.error('Error adding to wishlist:', error);
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
      {/* <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="/home"><i className="fa fa-home"></i> Home</Link>
                <span><h2>{subcategoryName || 'Shop'}</h2></span>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <ToastContainer />
      <section className='shop spad product product-sidebar footer-padding'>
        <div className='container'>
          {loading && <Loader />}
          <div className='row'>
            <div className='col-lg-3'>
              <div className='sidebar' data-aos='fade-right'>
                <div className='sidebar-section box-shadows'>
                  {subcategories.length > 0 && (
                    <div className='sidebar-wrapper'>
                      <h3 className='wrapper-heading'>Subcategories</h3>
                      <div className='sidebar-item'>
                        <ul className='sidebar-list'>
                          {subcategories.map(subcategory => (
                            <li key={subcategory.subcategory_id}>
                              <input
                                type='radio'
                                id={`subcategory-${subcategory.subcategory_id}`}
                                name='subcategory'
                                checked={
                                  selectedSubcategory ===
                                  subcategory.subcategory_id
                                }
                                onChange={() => {
                                  storeSelectedSubcategory(
                                    subcategory.subcategory_id
                                  );
                                  //setSubcategoryName(subcategory.subcategoryname);
                                  fetchProducts(
                                    category_id,
                                    subcategory.subcategory_id
                                  );
                                }}
                              />
                              <label
                                htmlFor={`subcategory-${subcategory.subcategory_id}`}
                              >
                                {subcategory.subcategoryname}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div class='login-btn'>
                <button
                  onClick={connectwhatsapp}
                  class='shop-btn shop-btn-full'
                >
                  If your product is not listed<br></br>Order on WhatsApp
                </button>
              </div>
            </div>

            <div className='col-lg-9 col-md-9'>
              <div className='row'>
                {products.length > 0 ? (
                  products.map(product => (
                    <div className='col-xl-4 col-sm-6' key={product.productid}>
                      <div className='product-wrapper m-2' data-aos='fade-up'>
                        {
                          product.discount > 0 &&
                          (<Discount price={product.price} discount={product.discount} />)
                        }
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
                              </span>`
                            </div>
                          </div>
                          {product.stock_quantity <= 0 && (
                            <p className='out-of-stock'>Out of Stock</p>
                          )}
                          {product.stock_quantity >0 && (
                            <div className='product-cart-btn'>
                              <div className='row'>
                                <div className='col-6'>
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
                                      <span>
                                        <svg
                                          width='24'
                                          height='23'
                                          viewBox='0 0 24 23'
                                          fill='none'
                                          xmlns='http://www.w3.org/2000/svg'
                                        >
                                          <path
                                            d='M16.1568 8.1772C16.0284 7.84626 15.7343 7.81766 14.2887 7.81766H13.0875V7.2947C13.0875 6.48165 12.9716 5.91374 12.6899 5.32949C12.1804 4.2713 11.3272 3.5318 10.2213 3.1886C9.68279 3.02517 8.87923 2.95572 8.39047 3.02926C7.03602 3.24172 5.88039 4.09562 5.29223 5.31315C5.00642 5.90966 4.89045 6.48165 4.89045 7.2947V7.82175H3.68511C2.23954 7.82175 1.94546 7.85035 1.81705 8.19354C1.75078 8.41008 1.12948 13.0637 0.864385 15.0697C0.632431 16.8184 0.417045 18.469 0.259648 19.711C-0.0137267 21.8519 -0.00544266 21.8846 0.00284141 21.9214V21.9255C0.0401198 22.0644 0.408761 22.428 0.520596 22.5342L1.00521 23H16.9438L17.3041 22.6854C17.4657 22.5424 18 22.0562 18 21.8152C18 21.6517 16.1899 8.27117 16.1568 8.1772ZM16.6911 21.5046C16.687 21.5332 16.6538 21.619 16.5958 21.6803L16.513 21.7702H1.46498L1.2496 21.5414L2.09871 15.2863C2.39694 13.0596 2.66203 11.1189 2.81943 9.95855C2.88984 9.45193 2.92298 9.19453 2.93955 9.06788C3.49872 9.06379 5.94252 9.0597 8.98278 9.0597H15.0302L15.0384 9.10465C15.1047 9.4315 16.6621 21.141 16.6911 21.5046ZM6.1372 7.82175V7.35598C6.1372 7.04139 6.17862 6.6083 6.22418 6.40811C6.46856 5.38669 7.30111 4.5573 8.34077 4.29173C8.77568 4.1855 9.48811 4.22228 9.92302 4.37753H9.92717C10.3828 4.5287 10.7556 4.77384 11.0994 5.14972C11.6544 5.74623 11.8408 6.28145 11.8408 7.27018V7.82175H6.1372Z'
                                            fill='black'
                                          />
                                        </svg>
                                      </span>
                                    </button>
                                  )}
                                </div>
                                <div className='col-6'>
                                  {userid && (
                                    <button
                                      onClick={() =>
                                        addToWishlist(product.productid)
                                      }
                                      className='product-btn mb-2'
                                      type='button'
                                    >
                                      <span>
                                        <svg
                                          width='28'
                                          height='23'
                                          viewBox='0 0 28 23'
                                          fill='none'
                                          xmlns='http://www.w3.org/2000/svg'
                                        >
                                          <path
                                            d='M4.97214 5.02422C3.71435 5.18246 2.6616 5.7007 1.7705 6.60267C0.970091 7.40971 0.489057 8.26421 0.213053 9.37586C-0.275867 11.3024 0.0789948 13.2013 1.25398 14.9855C2.00708 16.1288 2.98097 17.1772 4.76711 18.7754C5.90266 19.7921 9.36848 22.7591 9.53802 22.858C9.69574 22.953 9.75488 22.9648 10.09 22.9648C10.4252 22.9648 10.4843 22.953 10.642 22.858C10.8116 22.7591 14.2853 19.7881 15.413 18.7754C17.207 17.1692 18.173 16.1249 18.9261 14.9855C20.1011 13.2013 20.4559 11.3024 19.967 9.37586C19.691 8.26421 19.21 7.40971 18.4096 6.60267C17.6131 5.7996 16.7614 5.33674 15.6456 5.09938C15.0857 4.9807 14.0526 4.96883 13.5637 5.0796C12.1995 5.3763 11.1546 6.0607 10.2004 7.27916L10.09 7.41762L9.98357 7.27916C9.04122 6.08443 8.01212 5.40004 6.69913 5.09938C6.30878 5.00839 5.4098 4.96883 4.97214 5.02422ZM6.28907 6.23081C7.40885 6.42861 8.37487 7.0774 9.13979 8.14948C9.26991 8.33542 9.43156 8.55696 9.49465 8.64795C9.78643 9.05937 10.3936 9.05937 10.6854 8.64795C10.7485 8.55696 10.9102 8.33542 11.0403 8.14948C12.0851 6.68575 13.5401 5.9974 15.1251 6.21498C16.8837 6.4563 18.2558 7.69058 18.7802 9.50641C19.1942 10.9424 19.0128 12.4497 18.2597 13.8066C17.6289 14.942 16.5761 16.1328 14.7427 17.7824C13.8555 18.5776 10.1255 21.7978 10.09 21.7978C10.0506 21.7978 6.33638 18.5895 5.4374 17.7824C2.61823 15.2466 1.50633 13.6642 1.23821 11.8088C1.06472 10.6101 1.31312 9.32047 1.91639 8.30377C2.82326 6.77278 4.58968 5.9341 6.28907 6.23081Z'
                                            fill='black'
                                          />                                          
                                        </svg>
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </div>
                              <Link to="/checkout">
                                <button
                                  className='product-btn mb-2'
                                  type='button'
                                >
                                  Buy Now
                                </button>
                              </Link>
                              {/* conditional buttons */}
                              {usertype === 'admin' && (
                                <button
                                  className='product-btn mt-2'
                                  type='button'
                                  onClick={() => {
                                    setShowPopup(true);
                                    setSingleProduct(product);
                                  }}
                                >
                                  Add to Pending Orders
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
                    <p>No products available for this subcategory</p>
                  </div>
                )}
              </div>
            </div>
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

export default Productlist;
