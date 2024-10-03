import React, { useState, useEffect } from "react";
import Input from "../input/input.js";
import Button from "../button/button.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFileInvoice, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./editInvoice.css";
// import "../add_invoice/addInvoice.css"
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';

const EditInvoice = () => {
  const { id } = useParams(); // Extract the invoice ID from the URL
  const navigate = useNavigate(); // Initialize navigate function instead of useHistory
  const [invoice, setInvoice] = useState({
    date: '',
    invoiceNumber: '',
    invoiceTo: '',
    customerGST: '',
    items: [],
    subtotal: 0,
    cgst: 0,
    sgst: 0,
    totalAmount: 0,
    paidAmount: 0,
    balanceAmount: 0,
  });

  // Fetch the invoice to edit
  useEffect(() => {
    axios
      .get(`http://localhost:3001/invoices/${id}`)
      .then((response) => {
        const invoiceData = response.data;
        
        // Ensure the date is formatted as YYYY-MM-DD
        const formattedDate = new Date(invoiceData.date).toISOString().split('T')[0];
        
        // Update the invoice state
        setInvoice({
          ...invoiceData,
          date: formattedDate, // Set the formatted date here
        });
      })
      .catch((error) => {
        console.error("Error fetching invoice:", error);
      });
  }, [id]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = invoice.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === "price" || field === "qty") {
          const price = parseFloat(updatedItem.price) || 0;
          const qty = parseFloat(updatedItem.qty) || 0;
          updatedItem.total = price * qty;
        }
        return updatedItem;
      }
      return item;
    });

    setInvoice((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // Effect to calculate subtotal, CGST, SGST, and total amount
  useEffect(() => {
    const subtotalValue = invoice.items.reduce((acc, item) => acc + (item.total || 0), 0);
    const cgstValue = (subtotalValue * 9) / 100;
    const sgstValue = (subtotalValue * 9) / 100;
    const totalValue = subtotalValue + cgstValue + sgstValue;

    setInvoice((prev) => ({
      ...prev,
      subtotal: subtotalValue,
      cgst: cgstValue,
      sgst: sgstValue,
      totalAmount: totalValue,
      balanceAmount: totalValue - prev.paidAmount,
    }));
  }, [invoice.items, invoice.paidAmount]);

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { item: "", price: 0, qty: 0, total: 0 }],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    setInvoice((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // Handle Save Operation
  const handleSave = () => {
    axios
      .put(`http://localhost:3001/invoices/${id}`, invoice)
      .then((response) => {
        alert("Invoice updated successfully!");
        navigate("/view-invoice"); // Navigate to invoice list after save
      })
      .catch((error) => {
        console.error("Error updating invoice:", error);
      });
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h3 className="invoice-items-heading">
        <FontAwesomeIcon icon={faFileInvoice} /> Edit Invoice
      </h3>
      <div className="form-row">
        <div className="half-width">
          <Input
            type="date"
            id="date"
            name="date"
            label="Date:"
            value={invoice.date}
            onChange={handleInputChange}
          />
        </div>
        <div className="half-width">
          <Input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            label="Invoice Number:"
            value={invoice.invoiceNumber}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <Input
        type="text"
        id="invoiceTo"
        name="invoiceTo"
        label="Invoice To:"
        value={invoice.invoiceTo}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        id="customerGST"
        name="customerGST"
        label="Customer GST Number:"
        value={invoice.customerGST}
        onChange={handleInputChange}
      />

      <div className="invoice-items-container">
        <table className="invoice-items-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <Input
                    type="text"
                    value={item.item}
                    onChange={(e) => handleItemChange(index, "item", e.target.value)}
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, "price", e.target.value)}
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                  />
                </td>
                <td>
                <Input
                    type="number"
                    value={item.total.toFixed(2)}
                    readOnly
                  />
                </td>
                <td>
                  <button className="remove-btn" onClick={() => removeItem(index)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="edit-add-item-btn" onClick={addItem}>
          <FontAwesomeIcon icon={faPlus} /> Add Item
        </button>
      </div>

      <Input type="text" label="Subtotal:" value={invoice.subtotal.toFixed(2)} readOnly />
      <Input type="text" label="CGST (9%):" value={invoice.cgst.toFixed(2)} readOnly />
      <Input type="text" label="SGST (9%):" value={invoice.sgst.toFixed(2)} readOnly />
      <Input type="text" label="Total Amount:" value={invoice.totalAmount.toFixed(2)} readOnly />
      <Input
        type="number"
        label="Paid Amount:"
        value={invoice.paidAmount}
        onChange={(e) => handleInputChange(e)}
        name="paidAmount"
      />
      <Input type="text" label="Balance Amount:" value={invoice.balanceAmount.toFixed(2)} readOnly />

      <Button className="update-invoice-btn" name=" Save Invoice" icon={<FontAwesomeIcon icon={faSave} />} onClick={handleSave}/>
    </div>
  );
};

export default EditInvoice;
