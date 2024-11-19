import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import temp_product_image from '../assets/products/p-img-29.webp';
// import Loader from './loader/Loader';
// import loaderGif from '../assets/images/loaderGif'
import loaderGif from '../assets/images/loader.gif'
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
    setLoading(true);
    const { productid, prod_name, price, image, discount } = product;
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
          {loading && 
            <div className='loader-div'>
            <img className='loader-img'
              src={loaderGif}
              alt='Loading...'/>
          </div>
          }
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
                              {isInCart(product.productid) ? (
                                <Link to={'/cart'} className='product-btn mb-2'>
                                  Go to Cart
                                </Link>
                              ) : (
                                <button
                                  className='product-btn'
                                  onClick={() => handleAddToCart(product)}
                                  disabled={product.stock_quantity < 1}
                                >
                                  {loading ? 'Adding...' : 'Add to Cart'}
                                </button>
                              )}
                              <button
                                className='product-btn wishlist-btn'
                                onClick={() => addToWishlist(product.productid)}
                              >
                                <i className='fa fa-heart-o'></i> Add to
                                Wishlist
                              </button>
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
