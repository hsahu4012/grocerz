import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';

const OrderDetail = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [SelectedSingleproduct, setSelectedSingleproduct] = useState({});
    const { orderid } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const navigate = useNavigate();
    const usertype = 'admin';

    // Fetch all categories
    const fetchCategoryData = async () => {
        try {
            const url = `${process.env.REACT_APP_API_URL}category/allcategory`;
            const response = await axios.get(url);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch subcategories based on selected category
    const fetchSubCategoryData = async (Categoryid) => {
        try {
            if (Categoryid) {
                const url = `${process.env.REACT_APP_API_URL}subCategory/categoryid/${Categoryid}`;
                const response = await axios.get(url);
                setSubcategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    // Fetch products based on selected subcategory
    const fetchProductsData = async (subCategoryid) => {
        try {
            if (subCategoryid) {
                const url = `${process.env.REACT_APP_API_URL}products/bySubCategoryId/${subCategoryid}`;
                const response = await axios.get(url);
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Fetch order details
    const fetchOrderDetails = async () => {
        try {
            const url = `${process.env.REACT_APP_API_URL}orderdetails/${orderid}`;
            const response = await axios.get(url);
            setOrderDetails(response.data);
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };
    // Handle adding product to order
    const handleAddProduct = async () => {
        try {
            const productObj = products.find(product => product.productid === selectedProduct);
            setSelectedSingleproduct(productObj)
            const url = `${process.env.REACT_APP_API_URL}orderdetails/addProductInToOrder/${orderid}`;
            await axios.post(url, SelectedSingleproduct);
            fetchOrderDetails(); 
            setShowPopup(false);
        } catch (error) {
            console.error('Error adding product to order:', error);
        }
    };

    // Handle removing product from order
    const removeItemFromOrder = async (productid) => {
        try {
            const url = `${process.env.REACT_APP_API_URL}orderdetails/removeOrderProduct/${orderid}/${productid}`;
            await axios.put(url);
            fetchOrderDetails(); // Refresh order details after removing product
        } catch (error) {
            console.error("Error removing product from order:", error);
        }
    };

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategoryData();
        fetchOrderDetails();
    }, [orderid]);

    // Fetch subcategories when selectedCategory changes
    useEffect(() => {
        fetchSubCategoryData(selectedCategory);
    }, [selectedCategory]);

    // Fetch products when selectedSubcategory changes
    useEffect(() => {
        fetchProductsData(selectedSubcategory);
    }, [selectedSubcategory]);

    const order = orderDetails.length > 0 ? orderDetails[0] : null;

    return (
        <>
            <section className="blog about-blog">
                <div className="container">
                    <div className="blog-heading about-heading">
                        <h1 className="heading">Order Details</h1>
                    </div>
                </div>
            </section>

            <section className="user-profile footer-padding">
                <div className="container">
                    <div className="user-profile-section box-shadows">
                        <div className="user-dashboard">
                            <DashboardRoutes />
                            <div className="container mt-5">
                                <h2 className="mb-4 main-heading-custom-font-1">Order Summary - {order && order.srno}</h2>
                                <div className="card">
                                    {order ? (
                                        <div className="card-body">
                                            <p><strong>Order Date & Time :</strong> {order.order_date} {order.order_time} | <strong>Order# :</strong> {order.order_id} | <strong>Order ID :</strong> {order.srno}</p>
                                            <div className="row my-5">
                                                <div className="col-sm-12 text-custom-font-1">
                                                    <div className="heading-custom-font-1">Shipping Address</div>
                                                    <strong>Name :</strong> {order.name}
                                                    <p><strong>Address :</strong> {order.line1}, {order.city}</p>
                                                    <p><strong>Landmark :</strong> {order.landmark}</p>
                                                    <span><strong>Contact: </strong>{order.contact}, {order.alternatecontact}</span>
                                                </div>
                                            </div>

                                            <div className="row my-5">
                                                <div className="col-sm-12">
                                                    <div className="heading-custom-font-1">Bill Details</div>
                                                    <ul className="list-group text-custom-font-1">
                                                        <li className="list-group-item">Total Amount - {order.paymentamount}</li>
                                                        <li className="list-group-item">Delivery Charge - 20</li>
                                                        <li className="list-group-item">Promotional Discount - 20</li>
                                                        <li className="list-group-item text-success"><strong>Final Payment Amount - {order.paymentamount}</strong></li>
                                                        <li className="list-group-item">Payment Mode - {order.paymentmode}</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="my-5">
                                                <div className="heading-custom-font-1">Items List</div>
                                                {usertype === 'admin' && (
                                                    <div className="shop-btn mx-1" onClick={() => setShowPopup(true)}>Add Product to existing order</div>
                                                )}

                                                {showPopup && (
                                                    <div className="popup-overlay">
                                                        <div className="popup-content">
                                                            <h3>Select Product</h3>

                                                            {/* Category Selection */}
                                                            <select
                                                                value={selectedCategory}
                                                                onChange={(e) => setSelectedCategory(e.target.value)}>
                                                                <option value="">Select Category</option>
                                                                {categories.map(category => (
                                                                    <option key={category.category_id} value={category.category_id}>
                                                                        {category.categoryname}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            {/* Subcategory Selection */}
                                                            {selectedCategory && (
                                                                <select
                                                                    value={selectedSubcategory}
                                                                    onChange={(e) => setSelectedSubcategory(e.target.value)}>
                                                                    <option value="">Select Subcategory</option>
                                                                    {subcategories
                                                                        .filter(sub => sub.category_id === selectedCategory)
                                                                        .map(subcategory => (
                                                                            <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                                                                                {subcategory.subcategoryname}
                                                                            </option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            )}

                                                            {/* Product List Selection */}
                                                            {selectedSubcategory && (
                                                                <select
                                                                    value={selectedProduct}
                                                                    onChange={(e) =>{setSelectedProduct(e.target.value)} }>
                                                                    <option value="">Select Product</option>
                                                                    {products
                                                                        .filter(product => product.subcategory_id === selectedSubcategory)
                                                                        .map(product => (
                                                                            <option key={product.productid} value={product.productid}>
                                                                                {product.prod_name} <span style={{ color: "#34a853" }}> Price {product.price}</span>
                                                                            </option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            )}
                                                            <button onClick={handleAddProduct}>
                                                                Add Product
                                                            </button>
                                                            <button onClick={() => setShowPopup(false)}>Close</button>
                                                        </div>
                                                    </div>
                                                )}

                                                {orderDetails.map((item, index) => (
                                                    <div className="card mb-1" key={index} style={{ cursor: 'pointer' }}
                                                    >
                                                        <div className="card-body d-flex align-items-center">
                                                            <div className="col-md-3">
                                                                <img src={`${process.env.REACT_APP_IMAGE_URL}${item.image}`} className="img-fluid" alt={`${process.env.REACT_APP_IMAGE_URL}${item.prod_name}`} />
                                                            </div>
                                                            <div className="col-md-9 d-flex justify-content-between align-items-center">
                                                                <p><strong>{item.prod_name}</strong></p>
                                                                <p><strong>Qty: {item.quantity}</strong></p>
                                                                <p><strong>&#8377;&nbsp;{item.price_final}</strong></p>
                                                                {usertype === 'admin' && (
                                                                    <button onClick={(e) => { e.stopPropagation(); removeItemFromOrder(item.productid); }} className="shop-btn">
                                                                        Remove Product
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="heading-custom-font-1 my-5">Order Status : {order.delivery_status} </div>
                                            <div className="text-center">
                                                <Link to={`/orderhistory/orderdetailsprint/${orderid}/vendor`} className="shop-btn mx-1">Print for Vendor</Link>
                                                <Link to={`/orderhistory/orderdetailsprint/${orderid}/customer`} className="shop-btn mx-1">Print for Customer</Link>
                                                <Link to={`/orderhistory/orderdetailsprint/${orderid}/partner`} className="shop-btn mx-1">Print for Delivery Partner</Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>No order found.</p>
                                    )}
                                </div>
                            </div>
                            <Link to="/OrderHistory" className="shop-btn">Back</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default OrderDetail;
