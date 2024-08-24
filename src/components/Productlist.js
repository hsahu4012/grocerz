import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import temp_product_image from '../assets/products/p-img-29.webp';
import Loader from './loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
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
  const usertype = localStorage.getItem("usertype")
  // const usertype='admin'

  useEffect(() => {
    if (category_id) {
      fetchSubcategories(category_id);
    }
  }, [category_id]);

  const storeSelectedSubcategory = (firstSubcategoryId) => {
    // console.log('setting sub category id')
    setSelectedSubcategory(firstSubcategoryId);
    window.localStorage.setItem('selectedSubcategory', firstSubcategoryId);
  }

  const fetchSubcategories = async (categoryId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}subCategory/categoryid/${categoryId}`);
      console.log('Subcategories response:', response.data);
      setSubcategories(response.data);
      if (response.data.length > 0) {
        let subcategories = response.data.map(item => item.subcategory_id);
        let storedsubcategory = window.localStorage.getItem('selectedSubcategory');
        //console.log('subcategories', subcategories)
        //console.log('storedsubcategory', storedsubcategory)
        if (subcategories.indexOf(storedsubcategory) > -1) {
          //console.log('inside if', storedsubcategory)
          storeSelectedSubcategory(storedsubcategory);
          fetchProducts(categoryId, storedsubcategory);
          //setSubcategoryName(response.data[0].subcategoryname);
        }
        else {
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}products/bySubCategory`, {
        category: categoryId,
        subcategory: subcategoryId
      });
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
  }, [])

  useEffect(() => {
    fetchOrderIDs()
  }, [showPopup])

  const handleAddToCart = async (productid) => {
    setLoading(true);
    try {
      const quantity = 1;
      if(userid){
        const response = await axios.post(`${process.env.REACT_APP_API_URL}cart/addToCart`, {
          userid,
          productid,
          quantity
        });
        if(response.status === 200){
          toast.success("Product added to cart successfully");
        } else {
          toast.error("Failed to add product to cart");
        }
      }else{
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find(item => item.productid === productid);
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.push({ productid, quantity });
        }
         // Save the updated cart back to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Product added to cart successfully");
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    setLoading(false);
  };

  const addToWishlist = async (productid) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}wishlist/addToWishlist`, {
        userid,
        productid,
      });
      if (response.status === 200) {
        toast.success("Product added to wishlist successfully");
      } else {
        toast.error("Failed to add product to cart");
      }
      // setMessage(response.data.message || 'Added to wishlist');
    } catch (error) {
      setMessage('There was an error adding the product to the wishlist!');
      console.error('Error adding to wishlist:', error);
    }
    setLoading(false);
  };
  const handleAddProduct = async (productid) => {
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
      <section className="shop spad product product-sidebar footer-padding">
        <div className="container">
          {loading && <Loader />}
          <div className="row">
            <div className="col-lg-3">
              <div className="sidebar" data-aos="fade-right">
                <div className="sidebar-section box-shadows">
                  {subcategories.length > 0 && (
                    <div className="sidebar-wrapper">
                      <h3 className="wrapper-heading">Subcategories</h3>
                      <div className="sidebar-item">
                        <ul className="sidebar-list">
                          {subcategories.map(subcategory => (
                            <li key={subcategory.subcategory_id}>
                              <input
                                type="radio"
                                id={`subcategory-${subcategory.subcategory_id}`}
                                name="subcategory"
                                checked={selectedSubcategory === subcategory.subcategory_id}
                                onChange={() => {
                                  storeSelectedSubcategory(subcategory.subcategory_id);
                                  //setSubcategoryName(subcategory.subcategoryname);
                                  fetchProducts(category_id, subcategory.subcategory_id);
                                }}
                              />
                              <label htmlFor={`subcategory-${subcategory.subcategory_id}`}>{subcategory.subcategoryname}</label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-9 col-md-9">
              <div className="row">
                {products.length > 0 ? (
                  products.map(product => (
                    <div className="col-xl-4 col-sm-6" key={product.productid}>
                      <div className="product-wrapper m-2" data-aos="fade-up">
                        <Link to={`/product/${product.productid}`}>
                          <div className="product-img">
                            <img
                              src={product.image ? `${process.env.REACT_APP_IMAGE_URL}${product.image}` : temp_product_image}
                              alt={product.prod_name}
                            />
                          </div>
                        </Link>
                        <div className="product-info">
                          <div className="product-description">
                            <div className="product-details">{product.prod_name}</div>
                            <div className="price">
                              {(product.discount === 0) && <span className="price-cut">&#8377; &nbsp;{product.price}</span>}
                              <span className="new-price">&#8377; &nbsp;{product.price - product.discount}</span>
                            </div>
                          </div>
                          {product.stock_quantity < 1 && (
                            <p className="out-of-stock">Out of Stock</p>
                          )}
                          {product.stock_quantity > 0 && (
                            <div className="product-cart-btn">
                              <button onClick={() => handleAddToCart(product.productid)} className="product-btn mb-2" type="button">
                                Add to Cart
                              </button>
                              <button onClick={() => addToWishlist(product.productid)} className="product-btn" type="button">
                                Add to Wishlist
                              </button>
                              {usertype === 'admin' && <button className="product-btn mt-2" type="button" onClick={() => { setShowPopup(true); setSingleProduct(product); }}>
                                Add to Pending Orders
                              </button>}
                              {showPopup && (
                                <div className="popup-overlay">
                                  <div className="popup-content">
                                    <h3>Select Order ID</h3>
                                    <select
                                      value={selectedorderIDs}
                                      onChange={(e) => setselectedOrderIDs(e.target.value)}
                                    >
                                      <option value="">Select Order ID</option>
                                      {orderIDs.map(oid => (
                                        <option key={oid.order_id} value={oid.order_id}>
                                          {oid.srno} - {oid.order_id}
                                        </option>
                                      ))}
                                    </select>
                                    <button className='' onClick={handleAddProduct}>Add Product
                                    </button>
                                    <button onClick={() => setShowPopup(false)}>Close</button>
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
                  <div className="col-lg-12">
                    <p>No products available for this subcategory</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {message && (
        <div className="message">
          <p>{message}</p>
        </div>
      )}
    </>
  );
};

export default Productlist;
