import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';
import loaderGif from '../assets/images/loader.gif';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import hashedbitqr from '../assets/images/hashedbitqr.jpg';
const OrderDetail = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [Added_quantity, setQuantity] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [oldOrders, setOldOrders] = useState([]);
  const { orderid } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState(false);
  const usertype = window.localStorage.getItem('usertype');

  const [costPrice, setCostprice] = useState([])
  const [deliveryPartners, setDeliveryPartners] = useState([])
  const [modal, setModal] = useState(false)
  const [userid, setUserid] = useState('')

  const [productid, setproductid] = useState([]);
  const [quantity, setquantity] = useState(' ');
  // const [productPrices, setProductPrices] = useState([]);
  const [costPriceModal, setCostPriceModal] = useState(false);
  const [alertmodal, setAlertModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalOriginalPrice, settotalOriginalPrice] = useState(0);
  const [costAmount, setCostAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleOrderClick = order_id => {
    navigate(`/orderhistory/orderdetail/${order_id}`);
  };

  const fetchUseridFromOrderHistory = async () => {
    try {
      setLoading(true);
      const allOrdersResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}orders/allOrders`
      );
      const currentOrder = allOrdersResponse.data.find(
        (order) => order.order_id === orderid
      );

      if (currentOrder) {
        if (usertype === 'admin') {
          const oldOrdersResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}orders/getByuserId/${currentOrder.userid}`
          );
          const filteredOrders = oldOrdersResponse.data.filter(
            (order) => order.order_id !== orderid
          );
          setOldOrders(filteredOrders);
        }
      }
    } catch (err) {
      console.error('Error fetching userid', err);
    } finally {
      setLoading(false);
    }
  };


  const findClassNames = (order_status, delivery_status) => {
    if (order_status === 'COMPLETED' && delivery_status === 'DELIVERED') {
      return 'card-body bg-opacity-25 bg-success';
    }
    if (delivery_status === 'DELIVERED') {
      return 'card-body bg-info bg-opacity-25';
    }
    if (order_status === 'Placed') {
      return 'card-body bg-warning bg-opacity-25';
    }
    if (order_status === 'CANCELLED') {
      return 'card-body bg-danger bg-opacity-25';
    }
    if (order_status === 'COMPLETED') {
      return 'card-body bg-success bg-opacity-25';
    }
    return 'card-body bg-warning bg-opacity-25';
  };

  // Fetch all categories
  const fetchCategoryData = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}category/allcategory`;
      const response = await axios.get(url);
      setCategories(response.data);
    } catch (error) {
      setError('Error fetching categories !');
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch subcategories based on selected category
  const fetchSubCategoryData = async Categoryid => {
    try {
      if (Categoryid) {
        const url = `${process.env.REACT_APP_API_URL}subCategory/categoryid/${Categoryid}`;
        const response = await axios.get(url);
        setSubcategories(response.data);
      }
    } catch (error) {
      setError('Error fetching subcategories !');
      console.error('Error fetching subcategories:', error);
    }
  };

  // Fetch products based on selected subcategory
  const fetchProductsData = async subCategoryid => {
    try {
      if (subCategoryid) {
        const url = `${process.env.REACT_APP_API_URL}products/bySubCategory`;
        const response = await axios.post(url, { category, subcategory });
        let tempObj = response.data.map(temp => ({
          ...temp,
          price: temp.price - temp.discount,
        }));
        setProducts([...tempObj]);
      }
    } catch (error) {
      setError('Error fetching products !');
      console.error('Error fetching products:', error);
    }
  };

  // update quantity in orderDetails list
  const updateQuantity = (productId, newQuantity) => {
    const updatedOrderDetails = orderDetails.map(item => {
      if (item.productid === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setOrderDetails(updatedOrderDetails);
  };

  // Fetch order details
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}orderdetails/${orderid}`;
      const response = await axios.get(url);
      setOrderDetails(response.data);

      let total = 0;
      response.data.map(item => {
        total = total + (item.price * item.quantity);
      })
      setTotalPrice(total);

      const orderDetails = response.data;
      const updatedOrderDetails = orderDetails.map(item => {
        const totalOriginalPrice = item.original_mrp * item.quantity;
        // const totalDiscount = (totalOriginalPrice - item.price_final)*item.quantity;
        return { ...item, totalOriginalPrice };
      });
      // console.log(totalOriginalPrice)
      const totalOriginalPriceSum = updatedOrderDetails.reduce((acc, item) => acc + item.totalOriginalPrice, 0);
      settotalOriginalPrice(totalOriginalPriceSum);
      setOrderDetails(updatedOrderDetails);
      setquantity(updatedOrderDetails.map(order => order.quantity));
      // const extractedProductIds = orderDetails.map(order => order.productid);
      // const extractedQuantities = orderDetails.map(order => order.quantity);
      // setproductid(extractedProductIds);
      // setquantity(extractedQuantities);
    } catch (error) {
      setError('Something went wrong please try again !');
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDiscount = async () => {
    try {
      setLoading(true);

      const response = await axios.put(`${process.env.REACT_APP_API_URL}orders/updateDiscount/${orderid}`, {
        totaldiscount: discountAmount,
      });

      if (response.status === 200) {
        toast.success('Discount applied successfully!');
        await fetchOrderDetails();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 404) {
        toast.error('Order not found!');
      } else {
        toast.error('Failed to apply discount!');
      }
      console.error('Error applying discount:', error);
    } finally {
      setLoading(false);
      setShowDiscountPopup(false);
    }
  };

  const fetchCostAmount = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}orders/getcostamount/${orderid}`);
      setCostAmount(response.data.costamount || 0);
    } catch (error) {
      console.error('Error fetching cost amount:', error);
    }
  };

  // const product_price = async () => {
  //   try {
  //     const prices = [];
  //     for (let index = 0; index < productid.length; index++) {
  //       const url = `${process.env.REACT_APP_API_URL}products/productByPId/${productid[index]}`;
  //       const response = await axios.get(url);
  //       const product_prices = response.data.price;
  //       const total_product_price = product_prices * quantity[index];
  //       prices.push(total_product_price);
  //     }
  //     setProductPrices(prices);
  //   } catch (error) {
  //     console.error('Error fetching product prices:', error);
  //   }
  // };
  // useEffect(() => {
  //   if (productid.length > 0 && quantity.length > 0) {
  //     product_price();
  //   }
  // }, [productid, quantity]);

  // Handle adding product to order
  const handleAddProduct = async () => {
    try {
      setLoading(true);
      const productObj = products.find(product => product.productid === selectedProduct);

      // Add quantity to product
      const productWithQuantity = {
        ...productObj,
        quantity: Added_quantity,
      };
      const url = `${process.env.REACT_APP_API_URL}orderdetails/addProductInToOrder/${orderid}`;
      await axios.post(url, productWithQuantity);
      fetchOrderDetails();
      setShowPopup(false);
    } catch (error) {
      setError('Something went wrong please try again !');
      console.error('Error adding product to order:', error);
      toast.error('Something Went wrong please try again !');
    } finally {
      setLoading(false);
    }
  };
  // Handle removing product from order
  const removeItemFromOrder = async productid => {
    try {
      const url = `${process.env.REACT_APP_API_URL}orderdetails/removeOrderProduct/${orderid}/${productid}`;
      await axios.put(url);
      fetchOrderDetails(); // Refresh order details after removing product
    } catch (error) {
      console.error('Error removing product from order:', error);
      toast.error('Something Went wrong please try again !');
    }
  };

  // Handle delivary staff list
  const handleDeliveryStaff = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}users/deliverypartners`;
      const response = await axios.get(url);
      setDeliveryPartners(response.data[0]);
    } catch (error) {
      setError('Error fetching Delivery Partners !');
      console.error('Error fetching Delivery Partners:', error);
      toast.error('Something Went wrong please try again !');
    }
    setModal(!modal);
  };

  // Update delivery partner in orders table
  const fetchDeliveryPartner = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}orders/updatedeliverypartner/${orderid}/${userid}`;
      const response = await axios.put(url);
      if (response.status === 200) {
        //alert(response.data.message);

        setAlertModal(true);
      }
    } catch (error) {
      console.error('Error updating delivery partner from order:', error);
    }
    setModal(!modal);
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategoryData();
    fetchOrderDetails();
  }, [orderid]);

  // Fetch subcategories when category changes
  useEffect(() => {
    fetchSubCategoryData(category);
  }, [category]);

  // Fetch products when subcategory changes
  useEffect(() => {
    fetchProductsData(subcategory);
  }, [subcategory]);

  useEffect(() => {
    fetchOrderDetails();
    fetchCostAmount();
  }, [orderid]);

  useEffect(() => {
    fetchUseridFromOrderHistory();
    window.scrollTo(0, 0);
  }, [orderid]);


  // const totalOriginalPrice = productPrices.reduce((acc, curr) => acc + curr, 0);
  const order = orderDetails.length > 0 ? orderDetails[0] : null;

  // Handle add cost price 
  const handleCostPriceAdd = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}orders/addcostamount/${orderid}`
      const response = await axios.put(url, { costamount: costPrice });
      if (response.status == 200) {
        toast.success('Cost Price added!');
      }
    } catch (error) {
      console.error('Error fetching Delivery Partners:', error);
      toast.error('Something Went wrong please try again !');
    }
    setCostPriceModal(!costPriceModal);
  };

  return (
    <>
      <ToastContainer />
      <section className='blog about-blog'>
        <div className='container'>
          <div className='blog-heading about-heading'>
            <h1 className='heading'>Order Details</h1>
          </div>
        </div>
      </section>

      <section className='user-profile footer-padding'>
        <div className='container'>
          <div className='user-profile-section box-shadows'>
            <div className='user-dashboard'>
              <DashboardRoutes />
              <div className='container'>
                <h2 className='mb-4 main-heading-custom-font-1'>
                  Order Summary - {order && order.srno}
                </h2>
                <div className='card'>
                  {loading ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50vh',
                      }}
                    >
                      <img
                        src={loaderGif}
                        alt='Loading...'
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>
                  ) : order ? (
                    <div className='card-body'>
                      <p>
                        <strong>Order Date & Time :</strong>
                        <span className='text-success'>
                          {' '}
                          {order.order_date}{' '}
                          {order.order_time.substring(0, 4) +
                            ' ' +
                            order.order_time.substring(8, 12).toUpperCase()}
                        </span>{' '}
                        | <strong>Order ID :</strong>{' '}
                        <span className='text-success'>{order.order_id}</span> |{' '}
                        <strong>Order Number :</strong>{' '}
                        <span className='text-success'>{order.srno}</span>
                      </p>
                      <div className="row my-2">
                        <div className="col-lg-8 col-md-7 col-sm-12"
                        >
                          <div className='heading-custom-font-1'>
                            Shipping Address
                          </div>
                          <p className="mb-2">
                            <strong>Name :</strong> {order.name}
                          </p>
                          <p className="mb-2">
                            <strong>Address :</strong> {order.line1},{' '}
                            {order.city}
                          </p>
                          <p className="mb-2">
                            <strong>Landmark :</strong> {order.landmark}
                          </p>
                          <p className="mb-2">
                            <span>
                              <strong>Contact: </strong>
                              {order.contact}, {order.alternatecontact}
                            </span>
                          </p>
                        </div>
                        <div className="col-lg-4 col-md-5 col-sm-12 d-flex justify-content-end align-items-start pt-0 mt-0 ">
                          <div className="pt-0 mt-0 ">
                            <img
                              src={hashedbitqr}
                              alt="Shipping Preview"
                              className="img-fluid rounded"
                              width={175}
                              height={175}
                            />
                          </div>
                        </div>
                      </div>

                      <div className='row '>
                        <div className='col-sm-12'>
                          <div className='heading-custom-font-1'>
                            Bill Details
                          </div>
                          <ul className='list-group text-custom-font-1'>
                            <li className='list-group-item text-success'>
                              <strong>
                                Original Price - &#8377; {totalPrice}
                              </strong>
                            </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Discount - &#8377;{' '}
                                {totalPrice - order.paymentamount}
                              </strong>
                            </li>
                            {usertype === 'admin' && (
                              <li className='list-group-item text-success'>
                                <strong>
                                  Cost Price - &#8377; {costAmount}
                                </strong>
                              </li>
                            )}
                            <li className='list-group-item text-success'>
                              <strong>
                                Final Payment Amount - {order.paymentamount}
                              </strong>
                            </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Payment Mode - {order.paymentmode}
                              </strong>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className='my-5'>
                        <div className='heading-custom-font-1'>Items List</div>
                        {usertype === 'admin' && (
                          <>
                            <div
                              className='btn shop-btn mx-1'
                              onClick={() => setShowPopup(true)}
                            >
                              Add Product to existing order
                            </div>
                            <div
                              className='btn shop-btn mx-4'
                              onClick={() => setShowDiscountPopup(true)}
                            >
                              Provide Additional Discount
                            </div>
                          </>
                        )}
                        {showPopup && (
                          <div className='popup-overlay'>
                            <div className='popup-content'>
                              <h3>Select Product</h3>

                              {/* Category Selection */}
                              <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                              >
                                <option value=''>Select Category</option>
                                {categories.map(category => (
                                  <option
                                    key={category.category_id}
                                    value={category.category_id}
                                  >
                                    {category.categoryname}
                                  </option>
                                ))}
                              </select>

                              {/* Subcategory Selection */}
                              {category && (
                                <select
                                  value={subcategory}
                                  onChange={e => setSubcategory(e.target.value)}
                                >
                                  <option value=''>Select Subcategory</option>
                                  {subcategories
                                    .filter(sub => sub.category_id === category)
                                    .map(subcategory => (
                                      <option
                                        key={subcategory.subcategory_id}
                                        value={subcategory.subcategory_id}
                                      >
                                        {subcategory.subcategoryname}
                                      </option>
                                    ))}
                                </select>
                              )}

                              {/* Product List Selection */}
                              {subcategory && (
                                <select
                                  value={selectedProduct}
                                  onChange={e => {
                                    setSelectedProduct(e.target.value);
                                  }}
                                >
                                  <option value=''>Select Product</option>
                                  {products.length > 0 &&
                                    products.map(product => (
                                      <option
                                        key={product.productid}
                                        value={product.productid}
                                      >
                                        {product.prod_name}{' '}
                                        <span style={{ color: '#34a853' }}>
                                          {' '}
                                          Price {product.price}
                                        </span>
                                      </option>
                                    ))}
                                </select>
                              )}

                              {/* Quantity Selection */}
                              {selectedProduct && (
                                <input
                                  type='number'
                                  value={Added_quantity || ''}
                                  onChange={e => {
                                    const newQuantity = parseInt(
                                      e.target.value
                                    );
                                    if (newQuantity >= 1) {
                                      setQuantity(newQuantity);
                                      updateQuantity(
                                        selectedProduct,
                                        newQuantity
                                      );
                                    }
                                  }}
                                  min='1'
                                  step='1'
                                  placeholder='Select Quantity'
                                  style={{
                                    backgroundColor: '#f5f5f5',
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '15px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '15px',
                                  }}
                                />
                              )}

                              <button className='btn shop-btn' onClick={handleAddProduct}>
                                Add Product
                              </button>
                              <button className='btn shop-btn' onClick={() => setShowPopup(false)}>
                                Close
                              </button>
                              {loading && (
                                <div className='spinner-overlay'>
                                  <p className='spinner2'></p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="card mb-1">
                          <div className="card-body d-flex align-items-center bg-light">
                            <div className="col-md-1">
                              <strong>#</strong>
                            </div>
                            <div className="col-md-3">
                              <strong>Image</strong>
                            </div>
                            <div className="col-md-3">
                              <strong>Product Name</strong>
                            </div>
                            <div className="col-md-1">
                              <strong>Quantity</strong>
                            </div>
                            <div className="col-md-1">
                              <strong>Original MRP</strong>
                            </div>
                            <div className="col-md-1">
                              <strong>Discount</strong>
                            </div>
                            <div className="col-md-1">
                              <strong>Final Price</strong>
                            </div>
                            {usertype === 'admin' && (
                              <div className="col-md-2">
                                <strong>Action</strong>
                              </div>
                            )}
                          </div>
                          {orderDetails.map((item, index) => {
                            // Calculate discount for the product
                            // const discount_product = productPrices[index] - item.price_final;

                            return (
                              <div
                                className='card mb-1'
                                key={index}
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                  navigate(`/product/${item.productid}`)
                                }
                              >
                                <div className='card-body d-flex align-items-center'>
                                  <div className='col-md-1'>
                                    <span>
                                      <strong>{index + 1}</strong>
                                    </span>
                                  </div>
                                  <div className='col-md-3'>
                                    <img
                                      src={`${process.env.REACT_APP_IMAGE_URL}${item.image}`}
                                      className='img-fluid'
                                      alt={`${item.prod_name}`}
                                    />
                                  </div>
                                  <div className='col-md-3'>
                                    <p>
                                      <strong>{item.prod_name}</strong>
                                    </p>
                                  </div>
                                  <div className='col-md-1'>
                                    <p>
                                      <strong>
                                        &#8377;&nbsp;{item.quantity}
                                      </strong>
                                    </p>
                                  </div>
                                  <div className='col-md-1'>
                                    <p>
                                      <strong>
                                        &#8377;&nbsp;{item.price * item.quantity}
                                      </strong>
                                    </p>
                                  </div>
                                  <div className='col-md-1'>
                                    <p>
                                      <strong>
                                        {/* {item.original_mrp - item.price_final} */}
                                        {item.price * item.quantity - item.price_final}
                                      </strong>
                                    </p>
                                  </div>
                                  <div className='col-md-1'>
                                    <p>
                                      <strong> &#8377;&nbsp;{item.price_final}</strong>
                                    </p>
                                  </div>
                                  {usertype === 'admin' && (
                                    <div className='col-md-2'>
                                      <button
                                        className='btn btn-danger'
                                        onClick={e => {
                                          e.stopPropagation();
                                          removeItemFromOrder(item.productid);
                                        }}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className='heading-custom-font-1 my-5'>
                        Order Status : {order.delivery_status}{' '}
                      </div>
                      {usertype === 'deliverypartner' && (
                        <div className='text-center my-3'>
                          <div className='col-12 col-md-auto my-2'>
                            <div
                              className='btn shop-btn w-100'
                              onClick={() => setCostPriceModal(true)}
                            >
                              Add Cost Price
                            </div>
                          </div>
                        </div>
                      )}
                      {usertype === 'admin' && (
                        <div className='text-center my-3'>
                          <div className='row justify-content-center'>
                            {/* Download Invoice In PDF */}
                            {order.delivery_status !== "CANCELLED" ? (
                              <div className='col-12 col-md-auto my-2'>
                                <Link
                                  to={`/orderhistory/orderdetailsprint/${orderid}/customer/invoice`}
                                  className='shop-btn w-100'
                                >
                                  Download Invoice
                                </Link>
                              </div>)
                              :
                              (null)}

                            {/* Print Invoice Button */}
                            <div className='col-12 col-md-auto my-2'>
                              <Link
                                to={`/orderhistory/orderdetailsprint/${orderid}/customer`}
                                className='shop-btn w-100'
                              >
                                Print Invoice
                              </Link>
                            </div>

                            {/* Assign Delivery Staff Button */}
                            <div className='col-12 col-md-auto my-2'>
                              <button
                                className='btn shop-btn w-100'
                                onClick={handleDeliveryStaff}
                              >
                                Assign Delivery Staff
                              </button>
                            </div>

                            {/* Add Cost Price */}
                            <div className='col-12 col-md-auto my-2'>
                              <div
                                className='btn shop-btn w-100'
                                onClick={() => setCostPriceModal(true)}
                              >
                                Add Cost Price
                              </div>
                            </div>


                            {/* Chat with Customer button */}
                            <div className='col-12 col-md-auto my-2'>
                              <div className='btn shop-btn w-100'>
                                Chat with Customer
                              </div>
                            </div>

                            {/* Back Button */}
                            <div className='col-12 col-md-auto my-2'>
                              <Link to='/OrderHistory' className='shop-btn w-100'>
                                Back
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}


                      {usertype === 'user' && (
                        <div className='text-center my-3'>
                          <div className='d-flex justify-content-center'>
                            {/* Back Button */}
                            <Link to='/OrderHistory' className='shop-btn mx-1'>
                              Back
                            </Link>
                          </div>
                        </div>
                      )}
                      {modal && (
                        <div className='popup-overlay'>
                          <div className='popup-content'>
                            <h3>Select Delivery Partner</h3>

                            <select
                              value={userid}
                              onChange={e => setUserid(e.target.value)}
                            >
                              <option value1=''>Select</option>
                              {deliveryPartners.map(item => (
                                <option key={item.userid} value={item.userid}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                            <button className='btn shop-btn' onClick={fetchDeliveryPartner}>
                              Add Delivery Partner
                            </button>
                            <button className='btn shop-btn'
                              onClick={() => {
                                setUserid('');
                                setModal(!modal);
                              }}
                            >
                              Close
                            </button>
                            {loading && (
                              <div className='spinner-overlay'>
                                <p className='spinner2'></p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {alertmodal && (
                        <div className='popup-overlay'>
                          <div className='popup-content'>
                            <h3>Delivery Partner Assigned</h3>
                            <button
                              onClick={() => {
                                setAlertModal(!alertmodal);
                              }}
                            >
                              Ok
                            </button>
                            {loading && (
                              <div className='spinner-overlay'>
                                <p className='spinner2'></p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Add Discount Modal */}
                      {showDiscountPopup && (
                        <div className='popup-overlay'>
                          <div className='popup-content'>
                            <h3>Provide Additional Discount</h3>
                            <input
                              type='number'
                              onChange={e => setDiscountAmount(parseFloat(e.target.value) || 0)}
                              min='0'
                              step='0.01'
                              placeholder='Enter Discount Amount'
                              style={{
                                backgroundColor: '#f5f5f5',
                                width: '100%',
                                padding: '10px',
                                marginBottom: '15px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '15px',
                              }}
                            />
                            <button className='btn shop-btn' onClick={handleAddDiscount}>
                              Add Discount
                            </button>
                            <button className='btn shop-btn' onClick={() => setShowDiscountPopup(false)}>Close</button>
                            {loading && (
                              <div className='spinner-overlay'>
                                <p className='spinner2'></p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Add cost price modal */}
                      {costPriceModal && (
                        <div className='popup-overlay'>
                          <div className='popup-content'>
                            <h3>Enter Amount</h3>
                            <input
                              type='number'
                              value={costPrice}
                              onChange={e => {
                                const newAmount = parseFloat(e.target.value);
                                setCostprice(newAmount);
                              }}
                              min='0'
                              step='0.01'
                              placeholder='Enter Cost Amount'
                              style={{
                                backgroundColor: '#f5f5f5',
                                width: '100%',
                                padding: '10px',
                                marginBottom: '15px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '15px',
                              }}
                            />

                            <button className='btn shop-btn' onClick={handleCostPriceAdd}>
                              Add Cost Amount
                            </button>
                            <button className='btn shop-btn' onClick={() => setCostPriceModal(false)}>Close</button>
                            {loading && (
                              <div className='spinner-overlay'>
                                <p className='spinner2'></p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <p>No order found.</p>
                  )}
                </div>

                {usertype === 'admin' && (
                  <section className="mt-5 old-orders-section">
                    <h2 className='mb-2 main-heading-custom-font-1'>
                      Old Orders - {/*{order && order.srno}*/}
                    </h2>
                    <div className='card p-3'>
                      {loading ? (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '50vh',
                          }}
                        >
                          <img
                            src={loaderGif}
                            alt='Loading...'
                            style={{ width: '80px', height: '80px' }}
                          />
                        </div>
                      ) : oldOrders.length > 0 ? (
                        oldOrders.map((order, index) => (

                          <div key={index} className='card mb-3'>
                            <div className={findClassNames(order.order_status, order.delivery_status)}>
                              <div className='row'>
                                <div className='col-sm-12'>
                                  <div className='order-card'>
                                    <div className='order-details'>
                                      <h5 className='card-title'>
                                        <strong>
                                          Order NO - {order.srno}. Total ₹
                                          {order.paymentamount}
                                        </strong>
                                      </h5>
                                    </div>

                                    <button
                                      className='view-details-btn'
                                      onClick={() =>
                                        handleOrderClick(order.order_id)
                                      }>
                                      View Details
                                    </button>
                                  </div>
                                  <div className='text-end'></div>
                                  <p>
                                    <strong>Customer Name - </strong> {order.name}
                                  </p>
                                  <p>
                                    <strong>Order ID - </strong> {order.order_id}
                                  </p>
                                  <p>
                                    <strong>Placed on - </strong> {order.order_date},{' '}
                                    {order.order_time.substring(0, 4) + ' ' + order.order_time.substring(8, 12).toUpperCase()}
                                  </p>
                                  <p>
                                    <strong>Order Status -</strong>{' '}
                                    {order.order_status}
                                  </p>
                                  <p>
                                    <strong>Delivery Status -</strong>{' '}
                                    {order.delivery_status}
                                  </p>
                                  < p >
                                    <strong>Delivery Partner -</strong>{' '}

                                    {deliveryPartners.map((partner, index) => (
                                      (order.delivery_partner === partner.userid) ? <span>{'  '}{partner.name}</span> : <span>{' '}</span>
                                    ))
                                    }
                                  </p>
                                  <p>
                                    <strong >Cost Amount -</strong>{' '}
                                    <span>₹{order.costamount}</span>
                                  </p>
                                  <p>
                                    <strong>Payment Mode -</strong>{' '}
                                    {order.paymentmode}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No orders found.</p>
                      )}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderDetail;
