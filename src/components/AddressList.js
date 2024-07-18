import React, { useEffect, useState } from "react";
// import "../style.css";
import axios from "axios";
import { Link } from "react-router-dom";

import AddressListData from "./AddressListData";

const AddressList = () => {



    return (
        <>
            <div className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__links">
                                <a href="Home"><i class="fa fa-home"></i> Home</a>
                                <span>Address</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <section className="checkout spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">

                            <Link to="/address" class="site-btn" >Add a new address</Link>


                        </div>
                    </div>
                </div>
                <AddressListData />
            </section>

        </>
    );
};

export default AddressList;