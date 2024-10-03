import React, { useState, useEffect } from "react";
import Input from "../input/input.js";
import Button from "../button/button.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import "./addInvoice.css"; // Import the updated CSS
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddInvoice = () => {
  const [items, setItems] = useState([{ id: 1, item: "", price: "", qty: "", total: 0 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const navigate = useNavigate(); // Initialize navigate function instead of useHistory

  const addItem = () => {
    setItems([...items, { id: items.length + 1, item: "", price: "", qty: "", total: 0 }]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Calculate the total for the item based on price and quantity
        if (field === "price" || field === "qty") {
          const price = parseFloat(updatedItem.price) || 0;
          const qty = parseFloat(updatedItem.qty) || 0;
          updatedItem.total = price * qty; // Update total for this item
        }
        return updatedItem;
      }
      return item;
    });

    setItems(updatedItems);
  };

  // Effect to calculate subtotal, CGST, SGST, and total amount
  useEffect(() => {
    const subtotalValue = items.reduce((acc, item) => acc + (item.total || 0), 0);
    const cgstValue = (subtotalValue * 9) / 100;
    const sgstValue = (subtotalValue * 9) / 100;
    const totalValue = subtotalValue + cgstValue + sgstValue;

    setSubtotal(subtotalValue);
    setCgst(cgstValue);
    setSgst(sgstValue);
    setTotalAmount(totalValue);
  }, [items]);

  useEffect(() => {
    // Update balance amount when total amount or paid amount changes
    setBalanceAmount(totalAmount - paidAmount);
  }, [totalAmount, paidAmount]);

//Inserting Form Data to DB
  const handleSubmit = () => {
    const invoiceData = {
      date: document.getElementById("date").value,
      invoiceNumber: document.getElementById("invoiceNumber").value,
      invoiceTo: document.getElementById("invoiceTo").value,
      customerGST: document.getElementById("customerGST").value,
      subtotal,
      cgst,
      sgst,
      totalAmount,
      paidAmount,
      balanceAmount,
      items
    };
  
    axios
      .post("http://localhost:3001/add-invoice", invoiceData)
      .then((response) => {
        alert("Invoice generated successfully!");
        navigate("/view-invoice"); // Navigate to invoice list after save
      })
      .catch((error) => {
        console.error("Error saving invoice:", error);
      });
  };
  

  return (
    <div className="container">
      <h3 className="invoice-items-heading">
        <FontAwesomeIcon icon={faFileInvoice} /> Add Invoice
      </h3>
      <div className="form-row">
        <div className="half-width">
          <Input type="date" id="date" name="date" label="Date:" />
        </div>
        <div className="half-width">
          <Input type="text" id="invoiceNumber" name="invoiceNumber" label="Invoice Number:" />
        </div>
      </div>
      <Input type="text" id="invoiceTo" name="invoiceTo" label="Invoice To:" />
      <Input type="text" id="customerGST" name="customerGST" label="Customer GST Number:" />

      <div className="invoice-items-container">
        <table className="invoice-items-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr className="invoice-item" key={item.id}>
                <td>{index + 1}</td>
                <td>
                  <Input
                    type="text"
                    className="dynamicInput"
                    placeholder="Item"
                    value={item.item}
                    onChange={(e) => handleItemChange(item.id, "item", e.target.value)}
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    className="dynamicInput"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleItemChange(item.id, "price", e.target.value)}
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    className="dynamicInput"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => handleItemChange(item.id, "qty", e.target.value)}
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    className="dynamicInput"
                    value={item.total.toFixed(2) || 0} // Display total for the item
                    readOnly
                  />
                </td>
                <td>
                  <Button onClick={() => removeItem(item.id)} icon={<FontAwesomeIcon icon={faTrashAlt} />} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button onClick={addItem} icon={<FontAwesomeIcon icon={faPlus} />} name=" Add Item" className="addItem-btn" />

      <Input type="text" id="subtotal" name="subtotal" label="Subtotal:" value={subtotal.toFixed(2)} readOnly />
      <Input type="text" id="cgst" name="cgst" label="CGST (9%):" value={cgst.toFixed(2)} readOnly />
      <Input type="text" id="sgst" name="sgst" label="SGST (9%):" value={sgst.toFixed(2)} readOnly />
      <Input type="text" id="totalAmount" name="totalAmount" label="Total Amount:" value={totalAmount.toFixed(2)} readOnly />
      <Input
        type="text"
        id="paidAmount"
        name="paidAmount"
        label="Paid Amount:"
        value={paidAmount}
        onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)} // Ensure valid number input
      />
      <Input type="text" id="balanceAmount" name="balanceAmount" label="Balance Amount:" value={balanceAmount.toFixed(2)} readOnly />

      <Button name=" Generate Invoice"  onClick={handleSubmit} icon={<FontAwesomeIcon icon={faFileInvoice} />} className="Invoice-Gen-Btn" />
    </div>
  );
};

export default AddInvoice;
