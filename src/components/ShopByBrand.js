import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import temp_product_image from '../assets/products/p-img-29.webp';
import Loader from './loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import Discount from './shared/Discount_tag';

const ShopByBrand = () => {
  const { brand_id } = useParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const usertype = localStorage.getItem('usertype');
  const [showPopup, setShowPopup] = useState(false);
  const [orderIDs, setOrderIDs] = useState([]);
  const [selectedorderIDs, setselectedOrderIDs] = useState();
  const [singleProduct, setSingleProduct] = useState();
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    const storedCart =
      (localStorage.getItem('cart') &&
        JSON.parse(localStorage.getItem('cart'))) ||
      [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    fetchBrands();
  }, []);

  const connectwhatsapp = () => {
    const phoneNumber = '+918757499345';
    const message = `Hi. I want to place an order.`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank').focus();
  };

  useEffect(() => {
    if (brand_id) {
      fetchProducts(brand_id);
    }
  }, [brand_id]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}products/allBrandsByOrders`
      );
      setBrands(
        response.data.sort((a, b) => a.brand_name.localeCompare(b.brand_name))
      );
      if (response.data.length > 0) {
        const firstbrand_id = response.data[0].brand_id;
        setSelectedBrand(firstbrand_id);
        fetchProducts(firstbrand_id);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
    setLoading(false);
  };

  const fetchProducts = async (brand_id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}products/brand/${brand_id}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };
  const handleAddToCart = async (product) => {
    const { productid, prod_name, price, image, discount } = product;
    setLoading(productid);
    try {
      const quantity = 1;
      const userid = localStorage.getItem('userid');
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
          let cart = localStorage.getItem('cart')
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
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success('Product added to cart successfully');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding product to cart');
    }
    setLoading(false);
  };

  const addToWishlist = async productid => {
    setLoading(true);
    try {
      const userid = localStorage.getItem('userid');
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
        toast.error('Failed to add product to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Error adding product to wishlist');
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
      await axios.post(url, {
        ...singleProduct,
        quantity: selectedQuantity, // Pass selected quantity here
      });
      toast.success('Product added to order successfully'); 
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding product to order:', error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchOrderIDs();
  }, [showPopup]);

  const isInCart = productid => {
    return cart.some(item => item.productid === productid);
  };

  return (
    <>
      <ToastContainer />
      <section className='shop spad product product-sidebar footer-padding'>
        <div className='container'>
          {loading && <Loader />}
          <div className='row'>
            <div className='col-lg-3'>
              <div className='sidebar' data-aos='fade-right'>
                <div className='sidebar-section box-shadows'>
                  {/* Brands Section */}
                  {brands.length > 0 && (
                    <div className='sidebar-wrapper'>
                      <h3 className='wrapper-heading'>Brands</h3>
                      <div className='sidebar-item'>
                        <ul className='sidebar-list'>
                          {brands.map(brand => (
                            <li
                              key={brand.brand_id}
                              className={`brand-item ${brand.brand_id === selectedBrand ? 'active' : ''}`}
                            >
                              <input
                                type='radio'
                                id={`brand-${brand.brand_id}`}
                                name='brand'
                                checked={brand.brand_id === selectedBrand}
                                onChange={() => {
                                  setSelectedBrand(brand.brand_id);
                                  fetchProducts(brand.brand_id);
                                }}
                              />
                              <label htmlFor={`brand-${brand.brand_id}`}>
                                {brand.brand_name}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Order Button */}
              <div className='login-btn'>
                <button
                  onClick={connectwhatsapp}
                  className='shop-btn shop-btn-full'
                >
                  If your product is not listed
                  <br />
                  Order on WhatsApp
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
                              </span>
                            </div>
                          </div>
                          {product.stock_quantity < 1 && (
                            <p className='out-of-stock'>Out of Stock</p>
                          )}
                          {product.stock_quantity > 0 && (
                            <div className='product-cart-btn'>
                              <div className='row'>
                              <div className='col-8 w-75'>
                              {isInCart(product.productid) ? (
                                <Link to={'/cart'} className='product-btn mt-4'>
                                  Go to Cart
                                </Link>
                              ) : (
                                <button
                                  className='product-btn mt-4'
                                  onClick={() => handleAddToCart(product)}
                                  disabled={product.stock_quantity < 1}
                                >
                                  {loading === product.productid ? 'Adding...' : 'Add to Cart'}
                                </button>
                              )}
                              </div>
                              <div className='col-4 w-25'> 
                              <button
                                className='product-btn wishlist-btn mb-2'
                                onClick={() => addToWishlist(product.productid)}
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
                              </div>
                              </div>
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
                                    <h3>Select Quantity</h3>
                                    <select
                                      value={selectedQuantity}
                                      onChange={e =>
                                        setSelectedQuantity(
                                          Number(e.target.value)
                                        )
                                      }
                                    >
                                      <option value=''>Select Quantity</option>
                                      {Array.from(
                                        { length: product.stock_quantity },
                                        (_, index) => index + 1
                                      ).map(quantity => (
                                        <option
                                          key={quantity}
                                          value={quantity}
                                        >
                                          {quantity}
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
                    <p>No products available for this brand</p>
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

export default ShopByBrand;
