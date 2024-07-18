// import React, { useState } from "react";
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Subcategory = () => {
  const [dome, setdemo] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo5Q9zUcW2xzPpC56YtkwJbh9A95a9P6MFgQ&usqp=CAU";


  const temp = useParams();
  console.log(temp.productid);
  const [subcactegory, setSubcategory] = useState({})

  const subcategory = async (id) => {
    try {
      const url = await fetch('http://localhost:4000/products/bySubCategoryId/:001');
      const response = await axios.get(url);
      //console.log(response.data);
      setSubcategory(response.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    subcategory(temp.productid);
  }, [])




  return (
    <>
      <section class="shop spad">
        <div class="container">
          <div class="row">
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
            <div class="col-lg-9 col-md-9">
              <div class="row">
                {dome &&
                  dome.map(() => (
                    <>
                      <div class="col-lg-4 col-md-6">
                        <div class="product__item">
                          <div
                            class="product__item__pic set-bg"
                            data-setbg="img/shop/shop-2.jpg"
                          >
                            <img src={url} />
                          </div>
                          <div class="product__item__text">
                            <h6>
                              <a href="#">Flowy striped skirt</a>
                            </h6>
                            <div class="rating">
                              <i class="fa fa-star"></i>
                              <i class="fa fa-star"></i>
                              <i class="fa fa-star"></i>
                              <i class="fa fa-star"></i>
                              <i class="fa fa-star"></i>
                            </div>
                            <div class="product__price">$ 49.0</div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}

                <div class="col-lg-12 text-center">
                  <div class="pagination__option">
                    <a href="#">1</a>
                    <a href="#">2</a>
                    <a href="#">3</a>
                    <a href="#">
                      <i class="fa fa-angle-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Subcategory;
