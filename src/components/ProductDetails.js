import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from "axios";

import dress1 from '../assets/img/product/women/dress1.jpg';

const ProductDetails = () => {
  const [selectedSize, setSelectedSize] = useState("xs");
  const [selectedColor, setSelectedColor] = useState("red");
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);

  const { productid } = useParams();
  const userid = localStorage.getItem('userid');


  const [product, setProduct] = useState({
    image:
      "https://cdn.pixabay.com/photo/2016/12/06/09/30/blank-1886001_640.png",
    image1:
      "https://5.imimg.com/data5/HB/VQ/MY-44811379/men-black-plain-t-shirt.jpg",
    image2:
      "https://assets.ajio.com/medias/sys_master/root/20231012/O3AN/65281d84afa4cf41f53f4650/-473Wx593H-466701145-black-MODEL2.jpg",
    image3:
      "https://cdn11.bigcommerce.com/s-o7vdfbtasz/images/stencil/500x659/products/358/1048/i-once-lived-in-fargo-really-fargo-stuff-black-back__82397.1541002551.jpg?c=2",
      prod_name: "Essential structured blazer",
    brand: "Brand: SKMEIMore Men Watches from SKMEI",
    description:
      "Nemo enim ipsam voluptatem quia aspernatur aut odit aut loret fugit, sed quia consequuntur magni lores eos qui ratione voluptatem sequi nesciunt.",
    specification:
      "Traditionally, it has short sleeves and a round neckline, known as a crew neck, which lacks a collar. T-shirts are generally made of stretchy, light, and inexpensive fabric and are easy to clean.",
    reviews:
      "The most famous of T-shirts styles are crew necks, also known as classic T-shirts. These are T-shirts with a round circular neck. They provide excellent flexibility, and fit comfortably on your body giving you a toned appearance. They work well if you've got a long and narrow face with slightly sloped shoulders.",
    disc_price: "75$",
    price: "83$",
    shipping: "Free Shipping",
  });

  //tabchange
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Function to handle size selection
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  // Function to handle color selection
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  //product_detail_pic_left change
  const handleThumbnailClick = (imageUrl) => {
    setProduct({ ...product, image: imageUrl });
  };

  //for quantity
  const handleQuantityChange = (e) => {
    // Parse the input value to ensure it's a number
    const newQuantity = parseInt(e.target.value);

    // Check if the new quantity is less than 1
    if (newQuantity < 1) {
      // If it's less than 1, set the quantity to 1
      setQuantity(1);
    } else {
      // Otherwise, set the quantity to the new value
      setQuantity(newQuantity);
    }
  };

  //for data and Api
  const handleAddToCart = async () => {
    // Implement API call to add to cart
    const data = {
      quantity: quantity,
      disc_price: product.disc_price,
      image: product.image,
      name: product.name,
      size: selectedSize,
      color: selectedColor,
    };
    console.log(data, `Add data now`);
    await axios
      .post("http://localhost:4000/cart/addToCart", data)
      .then((response) => {
        if (response.status === 200) {
          console.log("Product added to cart successfully");
          // Reset quantity after successful addition to cart
          setQuantity(1);
        } else {
          console.error("Failed to add product to cart");
        }
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  };

  const fetchProductDetail = async() => {
    const response = await axios.get("http://localhost:4000/products/productById/" + productid)

    console.log('Product Details - ', response.data);

    setProduct(response.data);
  }

  useEffect(() => {
    fetchProductDetail();
  }, [])

  return (
    <>
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <Link to="/">
                  <i className="fa fa-home"></i> Home
                </Link>
                <a href="/women">Women’s </a>
                <span>Essential structured blazer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="product-details spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="product__details__pic">
                {/* <div className="product__details__pic__left product__thumb nice-scroll">
                  <a
                    className={`pt ${
                      product.image === product.image1 ? "active" : ""
                    }`}
                    href="#product-1"
                    onClick={() => handleThumbnailClick(product.image1)}
                  >
                    <img src={product.image1} alt="" />
                  </a>
                  <a
                    className={`pt ${
                      product.image === product.image2 ? "active" : ""
                    }`}
                    href="#product-1"
                    onClick={() => handleThumbnailClick(product.image2)}
                  >
                    <img src={product.image2} alt="" />
                  </a>
                  <a
                    className={`pt ${
                      product.image === product.image3 ? "active" : ""
                    }`}
                    href="#product-1"
                    onClick={() => handleThumbnailClick(product.image3)}
                  >
                    <img src={product.image3} alt="" />
                  </a>
                </div> */}
                <div className="product__details__slider__content">
                  <div className="product__details__pic__slider owl-carousel">
                    <img
                      data-hash="product-1"
                      className="product__big__img"
                      src={dress1 || product.image}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="product__details__text">
                <h3>
                  {product.prod_name} <span>{product.brand}</span>
                </h3>
                <div className="rating">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <span>( 138 reviews )</span>
                </div>
                <div className="product__details__price">
                  {product.price - (product.discount * product.price)/100} <span>{product.price}</span>
                </div>
                <p>{product.prod_desc}</p>
                <div className="product__details__button">
                  <div className="quantity">
                    <span>Quantity:</span>
                    <div className="pro-qty">
                      <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                    </div>
                  </div>
                  <button onClick={handleAddToCart} className="cart-btn">
                    <span className="icon_bag_alt"></span> Add to cart
                  </button>
                  <ul>
                    <li>
                      <a href="/wishlist">
                        <span className="icon_heart_alt"></span>
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <span className="icon_adjust-horiz"></span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="product__details__widget">
                  <ul>
                    <li>
                      <span>Availability:</span>
                      <div className="stock__checkbox">
                        <label for="stockin">
                          In Stock
                          <input type="checkbox" id="stockin"></input>
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <span>Available color:</span>
                      <div className="color__checkbox">
                        <label
                          htmlFor="red"
                          className={selectedColor === "red" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            name="color__radio"
                            id="red"
                            checked={selectedColor === "red"}
                            onChange={() => handleColorChange("red")}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <label
                          htmlFor="black"
                          className={selectedColor === "black" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            name="color__radio"
                            id="black"
                            checked={selectedColor === "black"}
                            onChange={() => handleColorChange("black")}
                          />
                          <span className="checkmark black-bg"></span>
                        </label>
                        <label
                          htmlFor="grey"
                          className={selectedColor === "grey" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            name="color__radio"
                            id="grey"
                            checked={selectedColor === "grey"}
                            onChange={() => handleColorChange("grey")}
                          />
                          <span className="checkmark grey-bg"></span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <span>Available size:</span>
                      <div className="size__btn">
                        <label
                          htmlFor="xs-btn"
                          className={selectedSize === "xs" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            id="xs-btn"
                            checked={selectedSize === "xs"}
                            onChange={() => handleSizeChange("xs")}
                          />
                          xs
                        </label>
                        <label
                          htmlFor="s-btn"
                          className={selectedSize === "s" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            id="s-btn"
                            checked={selectedSize === "s"}
                            onChange={() => handleSizeChange("s")}
                          />
                          s
                        </label>
                        <label
                          htmlFor="m-btn"
                          className={selectedSize === "m" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            id="m-btn"
                            checked={selectedSize === "m"}
                            onChange={() => handleSizeChange("m")}
                          />
                          m
                        </label>
                        <label
                          htmlFor="l-btn"
                          className={selectedSize === "l" ? "active" : ""}
                        >
                          <input
                            type="radio"
                            id="l-btn"
                            checked={selectedSize === "l"}
                            onChange={() => handleSizeChange("l")}
                          />
                          l
                        </label>
                      </div>
                    </li>
                    <li>
                      <span>Promotions:</span>
                      <p>{product.shipping}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-12">
              <div className="product__details__tab">
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    <a
                      href
                      className={`nav-link ${
                        activeTab === "description" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("description")}
                    >
                      Description
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href
                      className={`nav-link ${
                        activeTab === "specification" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("specification")}
                    >
                      Specification
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href
                      className={`nav-link ${
                        activeTab === "reviews" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("reviews")}
                    >
                      Reviews (2)
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    className={`tab-pane ${
                      activeTab === "description" ? "active" : ""
                    }`}
                  >
                    <h6>Description</h6>
                    <p>{product.description}</p>
                  </div>
                  <div
                    className={`tab-pane ${
                      activeTab === "specification" ? "active" : ""
                    }`}
                  >
                    <h6>Specification</h6>
                    <p>{product.specification}</p>
                  </div>
                  <div
                    className={`tab-pane ${
                      activeTab === "reviews" ? "active" : ""
                    }`}
                  >
                    <h6>Reviews (2)</h6>
                    <p>{product.reviews}</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
          {/* <div className="row">
            <div className="col-lg-12 text-center">
              <div className="related__title">
                <h5>RELATED PRODUCTS</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="product__item">
                <div
                  className="product__item__pic set-bg0"
                  data-setbg="https://preview.colorlib.com/theme/ashion/img/product/related/rp-1.jpg.webp"
                >
                  <div className="label new">New</div>
                  <ul className="product__hover">
                    <li>
                      <a
                        href="https://preview.colorlib.com/theme/ashion/img/product/related/rp-1.jpg.webp"
                        className="image-popup"
                      >
                        <span className="arrow_expand"></span>
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <span className="icon_heart_alt"></span>
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <span className="icon_bag_alt"></span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="product__item__text">
                  <h6>
                    <a href="/" className="text-decoration-none">
                      Buttons tweed blazer
                    </a>
                  </h6>
                  <div className="rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                  <div className="product__price">$ 59.0</div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="product__item">
                <div
                  className="product__item__pic set-bg1"
                  data-setbg="img/product/related/rp-2.jpg"
                >
                  <ul className="product__hover">
                    <li>
                      <a
                        href="img/product/related/rp-2.jpg"
                        className="image-popup"
                      >
                        <span className="arrow_expand"></span>
                      </a>
                    </li>
                    <li>
                      <a href="/productdetail">
                        <span className="icon_heart_alt"></span>
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <span className="icon_bag_alt"></span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="product__item__text">
                  <h6>
                    <a href="/" className="text-decoration-none">
                      Flowy striped skirt
                    </a>
                  </h6>
                  <div className="rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                  <div className="product__price">$ 49.0</div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="product__item">
                <div
                  className="product__item__pic set-bg2"
                  data-setbg="img/product/related/rp-3.jpg"
                >
                  <div className="label stockout">out of stock</div>
                  <ul className="product__hover">
                    <li>
                      <a
                        href="img/product/related/rp-3.jpg"
                        className="image-popup"
                      >
                        <span className="arrow_expand"></span>
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <span className="icon_heart_alt"></span>
                      </a>
                    </li>
                    <li>
                      <a href="/">
                        <span className="icon_bag_alt"></span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="product__item__text">
                  <h6>
                    <a href="/men" className="text-decoration-none">
                      Cotton T-Shirt
                    </a>
                  </h6>
                  <div className="rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                  <div className="product__price">$ 59.0</div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="product__item">
                <div
                  className="product__item__pic set-bg3"
                  data-setbg="img/product/related/rp-4.jpg"
                >
                  <ul className="product__hover">
                    <li>
                      <a
                        href="img/product/related/rp-4.jpg"
                        className="image-popup"
                      >
                        <span className="arrow_expand"></span>
                      </a>
                    </li>
                    <li>
                      <a href="/wishlist">
                        <span className="icon_heart_alt"></span>
                      </a>
                    </li>
                    <li>
                      <a href="/bag">
                        <span className="icon_bag_alt"></span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="product__item__text">
                  <h6>
                    <a href="/men" className="text-decoration-none">
                      Slim striped pocket shirt
                    </a>
                  </h6>
                  <div className="rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                  <div className="product__price">$ 59.0</div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
