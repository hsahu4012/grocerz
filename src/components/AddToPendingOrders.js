import React, { useState, useEffect } from 'react';
import axios from 'axios';
const AddToPendingOrders = ({ setShowPopup, singleProduct }) => {
  const [orderIDs, setOrderIDs] = useState([]);
  const [selectedorderIDs, setselectedOrderIDs] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [err, setErr] = useState('');
  const fetchOrderIDs = async () => {
    setLoading(true);
    try {
      const url = process.env.REACT_APP_API_URL + 'orders/allorderIDs';
      const response = await axios.get(url);
      setOrderIDs(response.data);
    } catch (error) {
      setErr("Unble to fetch Orders")
      console.error('Error fetching orderIDs:', error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderIDs()
  }, [])

  const handleAddProduct = async productid => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}orderdetails/addProductInToOrder/${selectedorderIDs}`;
      await axios.post(url, {
        ...singleProduct,
        quantity: selectedQuantity,
      });
      setErr("Product Added Successfully")
      setShowPopup(false);
    } catch (error) {
      setErr("Getting error while adding product to existing order")
      console.error('Error adding product to order:', error);
    }
    finally {
      setLoading(false);
    }
  };
  return (
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
        {/* <h3>Select Quantity</h3> */}
        {/* <select
          value={selectedQuantity}
          onChange={e =>
            setSelectedQuantity(
              Number(e.target.value)
            )
          }
        >
          {singleProduct?.stock_quantity
            ? Array.from(
              { length: singleProduct.stock_quantity },
              (_, index) => index + 1
            ).map(quantity => (
              <option key={quantity} value={quantity}>
                {quantity}
              </option>
            ))
            : null}

        </select> */}
        <h3>Enter Quantity</h3>
        <input
          className='form-control w-full font-3xl'
          type="number"
          value={selectedQuantity}
          onChange={e => {
            const value = Number(e.target.value);
            if (value > 0 && value <= (singleProduct?.stock_quantity || 0)) {
              setSelectedQuantity(value);
            }
          }}
          min="1"
          max={singleProduct?.stock_quantity || 0}
        />


        <button
          className='btn'
          onClick={handleAddProduct}
        >
          Add Product
        </button>
        <button className='btn btn-danger' onClick={() => setShowPopup(false)}>
          Close
        </button>
        {loading && <div className='spinner-overlay'><p className='spinner2'></p></div>}
        {err && (
  <p className="text-danger fw-bold p-2 bg-light">
    {err}
  </p>
)}

      </div>
    </div>
  )
}

export default AddToPendingOrders
