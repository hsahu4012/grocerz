import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Productlist = () => {
  const { category_id } = useParams();
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [message, setMessage] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const userid = localStorage.getItem('userid');

  useEffect(() => {
    if (category_id) {
      fetchSubcategories(category_id);
    }
  }, [category_id]);

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}subCategory/categoryid/${categoryId}`);
      console.log('Subcategories response:', response.data);
      setSubcategories(response.data);
      if (response.data.length > 0) {
        const firstSubcategoryId = response.data[0].subcategory_id;
        setSelectedSubcategory(firstSubcategoryId);
        fetchProducts(categoryId, firstSubcategoryId);
        setSubcategoryName(response.data[0].subcategoryname);
      } else {
        setProducts([]);
        setSubcategoryName('');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchProducts = async (categoryId, subcategoryId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}products/bySubCategory`, {
        category: categoryId,
        subcategory: subcategoryId
      });
      console.log('Products response:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (selectedSubcategory) {
      fetchProducts(category_id, selectedSubcategory);
    }
  }, [selectedSubcategory]);

  const handleAddToCart = async (productid) => {
    try {
      const quantity = 1;
      const response = await axios.post(`${process.env.REACT_APP_API_URL}cart/addToCart`, {
        userid,
        productid,
        quantity
      });
      setMessage(response.data.message || 'Added to cart');
    } catch (error) {
      setMessage('There was an error adding the product to the cart!');
      console.error('Error adding to cart:', error);
    }
  };

  const addToWishlist = async (productid) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}wishlist/addToWishlist`, {
        userid,
        productid,
      });
      setMessage(response.data.message || 'Added to wishlist');
    } catch (error) {
      setMessage('There was an error adding the product to the wishlist!');
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <>
      <div className="breadcrumb-option">
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
      </div>

      <section className="shop spad">
        <div className="container">
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
                                  setSelectedSubcategory(subcategory.subcategory_id);
                                  setSubcategoryName(subcategory.subcategoryname);
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
                    <div className="col-xl-4 col-sm-6 mb-4" key={product.productid}>
                      <div className="product-wrapper" data-aos="fade-up">
                        <div className="product-img">
                          <img
                            draggable="false"
                            src={ '/template_do_not_change/assets/images/homepage-one/product-img/p-img-1.webp'}
                            alt={product.name}
                            className="product-img__img"
                          />
                        </div>
                        <div className="product-content d-grid gap-2 col-6 mx-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                          <p className="product-title" 
                          style={{ margin: '5px 0', fontSize: '3 rem',fontWeight:'bold',color:'black' }}>{product.prod_name}</p>
                          <p className="product-price" style={{ boxSizing:'inherit' }}>${product.price}</p>
                          <button onClick={() => handleAddToCart(product.productid)} className="btn btn-primary"
                           style={{ color:'black' }} type='button'>Add to Cart</button>
                          <button onClick={() => addToWishlist(product.productid)} 
                          className="btn btn-primary" style={{ color:'black' }} type='button'>Add to Wishlist</button>
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
