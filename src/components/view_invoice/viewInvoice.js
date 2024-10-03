import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./viewInvoice.css";

const ViewInvoice = () => {
  const { id } = useParams(); // Get invoice ID from URL
  const navigate = useNavigate(); // Initialize navigate function
  const [invoice, setInvoice] = useState(null);

  // Fetch the invoice details by ID
  useEffect(() => {
    axios
      .get(`http://localhost:3001/invoices/${id}`)
      .then((response) => {
        setInvoice(response.data);
      })
      .catch((error) => {
        console.error("Error fetching invoice:", error);
      });
  }, [id]);

  const handlePrint = () => {
    window.print(); // Trigger print dialog
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="invoice-view-container">
      <div className="invoice-view-header">
        <div className="logo-section">
          <img src="/path/to/logo.png" alt="Logo" className="logo" />
        </div>
        <h3>Invoice</h3>
        <div className="invoice-actions">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          <button className="print-btn" onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} /> Print
          </button>
        </div>
      </div>
      
      <div className="invoice-info">
        <div className="invoice-to">
          <h4>Invoice To</h4>
          <p>{invoice.invoiceTo}</p>
          <p><strong>Customer GST:</strong> {invoice.customerGST}</p>
        </div>
        <div className="pay-to">
          <h4>Pay To</h4>
          <p><strong>Janakrishnamoorthy</strong></p>
          <p>42/A Subramaniya Swamy Kovil North Street, <br/> Bodinayakanur, Theni - 625513</p>
          <p><strong>GSTIN:</strong>GST8883521093</p>
          <p><strong>Date:</strong> {invoice.date}</p>
          <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
        </div>
      </div>
<div class="invoice-items-table-container">
        <table className="invoice-items-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.item}</td>
              <td>{item.price}</td>
              <td>{item.qty}</td>
              <td>{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

</div>
  

      <div className="invoice-summary">
        <div className="summary-left">
          <h4>Payment Information</h4>
          <p><strong>Bank Name:</strong></p>
          <p><strong>Account Holder:</strong></p>
          <p><strong>Account No:</strong></p>
          <p><strong>Branch Code:</strong></p>
          <p><strong>IFSC Code:</strong></p>
          <p><strong>Branch:</strong></p>
          <p><strong>G-Pay/UPI No:</strong></p>
        </div>
        <div className="summary-right">
          <p><strong>Subtotal:</strong> {invoice.subtotal.toFixed(2)}</p>
          <p><strong>CGST (9%):</strong> {invoice.cgst.toFixed(2)}</p>
          <p><strong>SGST (9%):</strong> {invoice.sgst.toFixed(2)}</p>
          <p className="total-amount"><strong>Total Amount:</strong> {invoice.totalAmount.toFixed(2)}</p>
          <p><strong>Paid Amount:</strong> {invoice.paidAmount.toFixed(2)}</p>
          <p><strong>Balance Amount:</strong> {invoice.balanceAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;
