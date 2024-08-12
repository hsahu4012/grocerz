import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import temp_product_image from '../assets/products/p-img-29.webp';
import Loader from './loader/Loader';

const ProductSearchList = () => {
  const location = useLocation();
  const [searchedProducts, setSearchProducts] = useState([]);
  const [message, setMessage] = useState('');
  const userid = localStorage.getItem('userid');
  const [loading, setLoading] = useState(false);
  const query = new URLSearchParams(location.search);
  useEffect(() => {
    fetchSearchedProducts();
  }, [query.get('q')]);

  const fetchSearchedProducts = async (categoryId) => {
    setLoading(true);
    try {

      const searchTerm = query.get('q');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}products/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchProducts(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
    setLoading(false);
  };

  const handleAddToCart = async (productid) => {
    setLoading(true);
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
    setLoading(false);
  };

  const addToWishlist = async (productid) => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <>

      <section className="shop spad product product-sidebar footer-padding">
        <div className="container">
          {loading && <Loader />}
          <div className="col-lg-9 col-md-9 mx-auto">
            <div className="row g-4">  {/* Added g-4 class for gutter spacing */}
              {searchedProducts.length > 0 ? (
                searchedProducts.map(product => (
                  <div className="col-lg-3 col-md-4 col-sm-6" key={product.productid}>
                    <div className="product-wrapper" data-aos="fade-up">
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
                        {userid && product.stock_quantity > 0 && (
                          <div className="product-cart-btn">
                            <button onClick={() => handleAddToCart(product.productid)} className="product-btn mb-2" type="button">
                              Add to Cart
                            </button>
                            <button onClick={() => addToWishlist(product.productid)} className="product-btn" type="button">
                              Add to Wishlist
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-lg-12">
                  <p>No any product available!</p>
                </div>
              )}
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

export default ProductSearchList;
