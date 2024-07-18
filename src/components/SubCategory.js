import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import dress1 from '../assets/img/product/women/dress1.jpg';

const Subcategory = () => {
  const { subcategory_id, subcategoryname } = useParams();
  const [products, setProducts] = useState([]);
  const [message ,setMessage] = useState('');
  const userid = localStorage.getItem('userid');
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products by subcategory ID
        let url = process.env.REACT_APP_API_URL + 'products/bySubCategoryId/' + subcategory_id;
        const response = await axios.get(url);
        setProducts(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("There was an error fetching the products!", error);
      }
    };

    console.log(subcategory_id)
    fetchProducts();
  }, [subcategory_id]);

  
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
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <>
      {/* Breadcrumb navigation */}
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <a href="index-2.html"><i className="fa fa-home"></i> Home</a>
                <span>Shop</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <section class="shop spad">
      <div className="container">
        <div className="row">
          {/* <h2>Products in  {subcategoryname}</h2> */}
          <div class="col-lg-3 col-md-3">
              <div class="shop__sidebar">
                <div class="sidebar__categories">
                  <div class="section-title">
                    <h4>Categories</h4>
                  </div>
                  <div class="categories__accordion">
                    <div class="accordion" id="accordionExample">
                      <div class="card">
                        <div class="card-heading active">
                          <a data-toggle="collapse" data-target="#collapseOne">Women</a>
                        </div>
                        <div id="collapseOne" class="collapse show" data-parent="#accordionExample">
                          <div class="card-body">
                            <ul>
                              <li><a href="#">Coats</a></li>
                              <li><a href="#">Jackets</a></li>
                              <li><a href="#">Dresses</a></li>
                              <li><a href="#">Shirts</a></li>
                              <li><a href="#">T-shirts</a></li>
                              <li><a href="#">Jeans</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="card">
                        <div class="card-heading">
                          <a data-toggle="collapse" data-target="#collapseTwo">Men</a>
                        </div>
                        <div id="collapseTwo" class="collapse" data-parent="#accordionExample">
                          <div class="card-body">
                            <ul>
                              <li><a href="#">Coats</a></li>
                              <li><a href="#">Jackets</a></li>
                              <li><a href="#">Dresses</a></li>
                              <li><a href="#">Shirts</a></li>
                              <li><a href="#">T-shirts</a></li>
                              <li><a href="#">Jeans</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="card">
                        <div class="card-heading">
                          <a data-toggle="collapse" data-target="#collapseThree">Kids</a>
                        </div>
                        <div id="collapseThree" class="collapse" data-parent="#accordionExample">
                          <div class="card-body">
                            <ul>
                              <li><a href="#">Coats</a></li>
                              <li><a href="#">Jackets</a></li>
                              <li><a href="#">Dresses</a></li>
                              <li><a href="#">Shirts</a></li>
                              <li><a href="#">T-shirts</a></li>
                              <li><a href="#">Jeans</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="card">
                        <div class="card-heading">
                          <a data-toggle="collapse" data-target="#collapseFour">Accessories</a>
                        </div>
                        <div id="collapseFour" class="collapse" data-parent="#accordionExample">
                          <div class="card-body">
                            <ul>
                              <li><a href="#">Coats</a></li>
                              <li><a href="#">Jackets</a></li>
                              <li><a href="#">Dresses</a></li>
                              <li><a href="#">Shirts</a></li>
                              <li><a href="#">T-shirts</a></li>
                              <li><a href="#">Jeans</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="card">
                        <div class="card-heading">
                          <a data-toggle="collapse" data-target="#collapseFive">Cosmetic</a>
                        </div>
                        <div id="collapseFive" class="collapse" data-parent="#accordionExample">
                          <div class="card-body">
                            <ul>
                              <li><a href="#">Coats</a></li>
                              <li><a href="#">Jackets</a></li>
                              <li><a href="#">Dresses</a></li>
                              <li><a href="#">Shirts</a></li>
                              <li><a href="#">T-shirts</a></li>
                              <li><a href="#">Jeans</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="sidebar__filter">
                  <div class="section-title">
                    <h4>Shop by price</h4>
                  </div>
                  <div class="filter-range-wrap">
                    <div class="price-range ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content" data-min="33" data-max="99"></div>
                    <div class="range-slider">
                      <div class="price-input">
                        <p>Price:</p>
                        <input type="text" id="minamount" />
                        <input type="text" id="maxamount" />
                      </div>
                    </div>
                  </div>
                  <a href="#">Filter</a>
                </div>
                <div class="sidebar__sizes">
                  <div class="section-title">
                    <h4>Shop by size</h4>
                  </div>
                  <div class="size__list">
                    <label for="xxs">
                      xxs
                      <input type="checkbox" id="xxs" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="xs">
                      xs
                      <input type="checkbox" id="xs" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="xss">
                      xs-s
                      <input type="checkbox" id="xss" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="s">
                      s
                      <input type="checkbox" id="s" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="m">
                      m
                      <input type="checkbox" id="m" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="ml">
                      m-l
                      <input type="checkbox" id="ml" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="l">
                      l
                      <input type="checkbox" id="l" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="xl">
                      xl
                      <input type="checkbox" id="xl" />
                      <span class="checkmark"></span>
                    </label>
                  </div>
                </div>
                <div class="sidebar__color">
                  <div class="section-title">
                    <h4>Shop by size</h4>
                  </div>
                  <div class="size__list color__list">
                    <label for="black">
                      Blacks
                      <input type="checkbox" id="black" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="whites">
                      Whites
                      <input type="checkbox" id="whites" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="reds">
                      Reds
                      <input type="checkbox" id="reds" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="greys">
                      Greys
                      <input type="checkbox" id="greys" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="blues">
                      Blues
                      <input type="checkbox" id="blues" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="beige">
                      Beige Tones
                      <input type="checkbox" id="beige" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="greens">
                      Greens
                      <input type="checkbox" id="greens" />
                      <span class="checkmark"></span>
                    </label>
                    <label for="yellows">
                      Yellows
                      <input type="checkbox" id="yellows" />
                      <span class="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          <div className="col-lg-9 col-md-9">
            <div className="row">
              {products.length > 0 ? (
                products.map(product => (
                  <div className="col-lg-3 col-md-6 mb-4" key={product.productid}>
                    <div className="card h-100">
                      <Link to={`/product/${product.productid}`}>
                        <img
                          draggable="false"
                          className="card-img-top"
                          // src="https://assets.myntassets.com/w_245,c_limit,fl_progressive,dpr_2.0/assets/images/2020/8/31/1dce9c3e-77fa-48f1-85a3-d3c136c1d73e1598892377652-USPA.jpg"
                          // src={dress1}
                          src={process.env.REACT_APP_IMAGE_URL + 'mypic-1719814501266.jpg'}
                          alt={product.prod_name}
                        />
                      </Link>
                      <div className="card-body">
                        <h5 className="card-title" style={{ textAlign: 'center' }}>{product.prod_name}</h5>
                        <div className="product__price" style={{ textAlign: 'center' }}>${product.price}</div>
                       <div className='row'>
                        <div className='col-md-9'>
                        <button onClick={() => handleAddToCart(product.productid)}
                          className="btn btn-primary d-block mx-auto mt-3">Add to cart</button>
                        </div>
                        <div className='col-md-3'>
                          <Link to ='#'   onClick={() => addToWishlist(product.productid)}>
                           <i class="fa fa-heart" aria-hidden="true"></i>
                           </Link></div>
                       </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-lg-12">
                  <p>No products found for this subcategory.</p>
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

export default Subcategory;
