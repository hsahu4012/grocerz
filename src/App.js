import React, { useState, useEffect } from "react";
import "./App.css";
// import "./style.css";
import { BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import DataApp from "./DataContext";
import axios from "axios";
import "./assets/css/style.css";

import Loader from "./components/loader/Loader";
import Checkout from './components/Checkout';
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Home from "./components/Home";
import Product from "./components/Product";
//import Category from "./components/Category";
import ProductDetails from "./components/ProductDetails";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Contact from "./components/Contact";
// import CategoryBack from "./components/Category_backup";
import Category from "./components/Category";
import Address from './components/Address';
import AddressList from "./components/AddressList";

import LoginAndSecurityPage from "./components/LoginAndSecurity";
import Nameedit from './components/Editpages/Nameedit'
import Emailedit from './components/Editpages/Emailedit';
import Mobilenoedit from './components/Editpages/mobilenoedit'
import ChangePassword from './components/Editpages/ChangePassword';

// import Subcategory from "./components/Subcategory";
import ShopCart from "./components/ShopCart";
import Wishlist from "./components/Wishlist";

import OrderDetail from "./components/OrderDetail";
import OrderHistory from "./components/OrderHistory";
import PaymentPage from "./components/PaymentPage";
import Dashboard from"./components/Dashboard";
import Productlist from "./components/Productlist";
import OrderSuccess from "./components/OrderSuccess";
import OrderDetailsPrint from "./components/OrderDetailsPrint";

import About from "./components/About";

 function App() {

  //temp code to keep server live
  // const callApiQsList = async () => {
  //   try {
  //     const url = process.env.REACT_APP_API_URL + 'category/allCategory';
  //     const response = await axios.get(url);
  //   }
  //   catch (error) { console.log(error); }
  // }

  // useEffect(() => {
  //   setInterval(() => callApiQsList(), 100000)
  // }, [])
  //temp code to keep server live
  // const App = () => {
  //   const [loading, setLoading] = useState(false);
  
  //   const location = useLocation();
  
  //   useEffect(() => {
  //     const handleStart = () => setLoading(true);
  //     const handleComplete = () => setLoading(false);
  
  //     handleStart(); // Start loading when the route changes
  //     handleComplete(); // Stop loading after the route has changed
  
  //     return () => {
  //       handleComplete();
  //     };
  //   }, [location]);

  return (
    <BrowserRouter>
        <DataApp>
          <Header />
          {/* <Header /> */}
          <Routes>
          <Route path="/loader" element={<Loader />} />
            <Route path="/home" element={<Home />} />
            <Route path="/category/:categoryname/:categoryid" element={<Category />} />
            {/* <Route path="/productdetail" element={<ProductDetails />} /> */}
            {/* <Route path="/category/:categoryid" element={<CategoryBack />} /> */}
            <Route path="/category/:category_id" element={<Productlist />} />
            <Route path="/product/:productid" element={<ProductDetails />} />


            <Route path="/cart" element={<ShopCart />} />
            <Route path="/wishlist" element={< Wishlist />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path="/paymentpage" element={<PaymentPage />} />
            <Route path="/ordersuccess" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />


            <Route path="/loginandsecurity" element={<LoginAndSecurityPage />} />
            <Route path='/address' element={<AddressList />} />
            <Route path='/addressnew' element={<Address />} />
            <Route path="/nameedit" element={<Nameedit />} />
            <Route path="/emailedit" element={<Emailedit />} />
            <Route path="/mobilenoedit" element={<Mobilenoedit />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/orderdetail" element={<OrderDetail />} />
            <Route path="/orderhistory/orderdetail/:orderid" element={<OrderDetail />} />
            <Route path="/orderhistory" element={<OrderHistory />} />
            <Route path="/orderhistory/orderdetailsprint/:orderid/:usertype" element={<OrderDetailsPrint />} />


            <Route path="/" element={<Home />} />

          </Routes>
          {/* <Home /> */}
          <Footer />
        </DataApp>
      </BrowserRouter>
  );
}

export default App;
