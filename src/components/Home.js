import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { marketCategory } from '../utils/category';
import GrocerySection from './GrocerySection';
import HomeSlider from './HomeSlider';
import HomeBottomSection from './HomeBottomSection';

const Home = () => {
  const [category, setCategory] = useState(marketCategory);

  // const fetchCartItems = async () => {
  //     try {
  //         const response = await axios.get(`${process.env.REACT_APP_API_URL}category/allCategory`);
  //         setCategory(response.data);
  //     } catch (error) {
  //         console.error("Error fetching cart items", error);
  //     }
  // };

  // useEffect(() => {
  //     fetchCartItems();
  // }, []);

  return (
    <>
      <HomeSlider />

      {/* Section fot cards */}
      {/* <div className='grocery-section container'>
        <GrocerySection />
      </div> */}

      {/* <section class="product flash-sale">
        <div class="container">
            <div class="flash-sale-section">
                <div class="countdown-section">
                    <div class="countdown-items">
                        <span id="day" class="number">{time.days}</span>
                        <span class=" text">Days</span>
                    </div>
                    <div class="countdown-items">
                        <span id="hour" class="number">{time.hours}</span>
                        <span class="text">Hours</span>
                    </div>
                    <div class="countdown-items">
                        <span id="minute" class="number">{time.minutes}</span>
                        <span class="text">Minutes</span>
                    </div>
                    <div class="countdown-items">
                        <span id="second" class="number">{time.seconds}</span>
                        <span class="text">Seconds</span>
                    </div>
                </div>
                <div class="flash-sale-content">
                    <h2 class="wrapper-heading">WOO! Flash Sale </h2>
                    <p class="wrapper-details">You get into the 2k+ best Products in br Flash offer with as in<br/>
                        shaped sofa for sale.
                    </p>
                    <Link to="/productAbcde" class="shop-btn">Shop Now
                        <span>
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <rect x="1.45312" y="0.914062" width="9.25346" height="2.05632"
                                    transform="rotate(45 1.45312 0.914062)" />
                                <rect x="8" y="7.45703" width="9.25346" height="2.05632"
                                    transform="rotate(135 8 7.45703)" />
                            </svg>
                        </span>
                    </Link>
                </div>
                <div class="discount-item">
                    <h3 class="discount-primary">
                        <span class="discount-text">26%</span>
                        <span class="discount-inner-text">OFF</span>
                    </h3>
                </div>
            </div>
        </div>
    </section> */}

      <section class='product-category product mt-5'>
        <div class='container'>
          {/*<div class="section-title">
                        <h3>Market Category</h3>
                        <a class="view">View All</a>
                    </div>*/}
          <div class='category-section'>
            {/* <div class="product-wrapper" data-aos="fade-right" data-aos-duration="100">
                            <div class="wrapper-img">
                                <img src="assets/images/homepage-one/category-img/c-img-1.webp" alt="img" />
                            </div>
                            <div class="wrapper-info">
                                
                                <a href="/subcategory" class="wrapper-details">Fruits</a>
                            </div>
                        </div> */}

            {category &&
              category.map((item, index) => (
                <Link
                  to={`/category/${item.category_id}`}
                  key={item.category_id}
                >
                  <div
                    class='product-wrapper'
                    data-aos='fade-right'
                    data-aos-duration='200'
                  >
                    <div class='wrapper-img'>
                      <img
                        src={item.image}
                        alt={item.categoryname}
                        width={150}
                        height={150}
                      />
                    </div>
                    <div class='wrapper-info'>
                      <a class='wrapper-details'>{item.categoryname}</a>
                    </div>
                  </div>
                </Link>
              ))}
            <div className='product-wrapper' data-aos='fade-right' data-aos-duration='200'>
  {/* <div className='wrapper-img'> */}
  <Link to={"/shopbybrand"} className='image-link'>
  <img
    src='assets/images/homepage-one/hero-img-1.webp'
    alt="Shop by brand"
    width={150}
    height={150}
    style={{
      transition: 'transform 0.3s',
    }}
    className='zoom-image'
  />
</Link>
<div className='wrapper-info'>
  <Link to={"/shopbybrand"} className='wrapper-details'>
    Shop By Brands
  </Link>
</div>

  </div>
</div>


          <HomeBottomSection />
        </div>
      </section>
    </>
  );
};
export default Home;
