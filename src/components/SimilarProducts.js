import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import temp_product_image from '../assets/products/p-img-29.webp';

const SimilarProducts = () => {
  const userid = localStorage.getItem('userid');
  const usertype = localStorage.getItem('usertype');
  const { productid } = useParams();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderIDs, setOrderIDs] = useState([]);
  const [selectedorderIDs, setselectedOrderIDs] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [singleProduct, setSingleProduct] = useState();
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [showAll, setShowAll] = useState(false);

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
        const existingProduct = cart.find(product => product.productid === productid);
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

  const isInCart = productid => {
    return cart.some(product => product.productid === productid);
  };

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}products/similar/${productid}`
        );
        setSimilarProducts(response.data);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      }
      setLoading(false);
    };

    if (productid) {
      fetchSimilarProducts();
    }
  }, [productid]);

  const productsToDisplay = showAll ? similarProducts : similarProducts.slice(0, 4);

  return (
    <div className='similar-products'>
      <h5>Similar Products</h5>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='row'>
          {similarProducts.length > 0 ? (
            productsToDisplay.map((product) => (
                <div className='col-xl-3 col-sm-5' key={product.productid}>
                <div className='product-wrapper m-1' data-aos='fade-up'>
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
                    {product.stock_quantity <=0 && (
                      <p className='out-of-stock'>Out of Stock</p>
                    )}
                    {product.stock_quantity > 0 && (
                      <div className='product-cart-btn'>
                        {/* conditional buttons */}
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
                            onClick={() =>
                              addToWishlist(product.productid)
                            }
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
            <p>No similar products found</p>
          )}
        </div>
      )}
      {!showAll && similarProducts.length > 4 && (
        <div className='text-center'>
        <button
          className='shop-btn'
          onClick={() => setShowAll(true)}
        >
          Show All
        </button>
      </div>
      )}
    </div>
  );
};

export default SimilarProducts;