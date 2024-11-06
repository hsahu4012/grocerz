import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';
import Loader from './loader/Loader';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
const OrderDetail = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [Added_quantity, setQuantity] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
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
const [totalOriginalPrice,settotalOriginalPrice] = useState(0);



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
      const orderDetails = response.data;
      const updatedOrderDetails = orderDetails.map(item => {
        const totalOriginalPrice = item.original_mrp * item.quantity;
        // const totalDiscount = (totalOriginalPrice - item.price_final)*item.quantity;
        return { ...item, totalOriginalPrice};
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
    window.scrollTo(0, 0);
  }, []);

  // const totalOriginalPrice = productPrices.reduce((acc, curr) => acc + curr, 0);
  const order = orderDetails.length > 0 ? orderDetails[0] : null;

    // Handle add cost price 
    const handleCostPriceAdd = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}orders/addcostamount/${orderid}`
        const response = await axios.put(url,{costamount:costPrice});
        if(response.status==200){
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
          {loading && (
            <div className='spinner-overlay'>
              <p className='spinner'></p>
            </div>
          )}
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
                  {order ? (
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
                      <div className='row my-5'>
                        <div className='col-sm-12 text-custom-font-1'>
                          <div className='heading-custom-font-1'>
                            Shipping Address
                          </div>
                          <strong>Name :</strong> {order.name}
                          <p>
                            <strong>Address :</strong> {order.line1},{' '}
                            {order.city}
                          </p>
                          <p>
                            <strong>Landmark :</strong> {order.landmark}
                          </p>
                          <span>
                            <strong>Contact: </strong>
                            {order.contact}, {order.alternatecontact}
                          </span>
                        </div>
                      </div>

                      <div className='row my-5'>
                        <div className='col-sm-12'>
                          <div className='heading-custom-font-1'>
                            Bill Details
                          </div>
                          <ul className='list-group text-custom-font-1'>
                            <li className='list-group-item text-success'>
                              <strong>
                                Original Price - &#8377; {totalOriginalPrice}
                              </strong>
                            </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Discount - &#8377;{' '}
                                {totalOriginalPrice - order.paymentamount}
                              </strong>
                            </li>
                            <li className='list-group-item text-success'>
                              <strong>
                                Final Payment Amount - {order.paymentamount}
                              </strong>
                            </li>
                            <li className='list-group-item'>
                              Payment Mode - {order.paymentmode}
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className='my-5'>
                        <div className='heading-custom-font-1'>Items List</div>
                        {usertype === 'admin' && (
                          <div
                            className='shop-btn mx-1'
                            onClick={() => setShowPopup(true)}
                          >
                            Add Product to existing order
                          </div>
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

                              <button className='' onClick={handleAddProduct}>
                                Add Product
                              </button>
                              <button onClick={() => setShowPopup(false)}>
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
                                <strong>Original MRP</strong>
                              </div>
                              <div className="col-md-1">
                                <strong>Quantity</strong>
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
                                      &#8377;&nbsp;{item.original_mrp}
                                    </strong>
                                  </p>
                                </div>
                                <div className='col-md-1'>
                                  <p>
                                    <strong>{item.quantity}</strong>
                                  </p>
                                </div>
                                <div className='col-md-1'>
                                  <p>
                                    <strong>
                                      {item.original_mrp - item.price_final}
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
                            {order.delivery_status != "CANCELLED" ? (
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
                            <button className='' onClick={fetchDeliveryPartner}>
                              Add Delivery Partner
                            </button>
                            <button
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

                            <button className='' onClick={handleCostPriceAdd}>
                              Add Cost Amount
                            </button>
                            <button onClick={() => setCostPriceModal(false)}>Close</button>
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderDetail;
