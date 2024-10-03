import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx'; // Import the xlsx library
import "./viewInvoices.css"; // Import any necessary CSS

const ViewInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 10; // Change this to set how many invoices to display per page
  const navigate = useNavigate(); // Declare useNavigate for routing

  // Fetch invoices from server
  useEffect(() => {
    axios.get("http://localhost:3001/invoices")
      .then((response) => {
        setInvoices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      });
  }, []);

  const handleView = (invoiceId) => {
    navigate(`/invoice-view/${invoiceId}`);
  };

  const handleEdit = (invoiceId) => {
    // Navigate to the edit invoice page with the specific invoiceId
    navigate(`/edit-invoice/${invoiceId}`);
  };

  const handleDelete = async (invoiceId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this invoice?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3001/invoices/${invoiceId}`);
      
      // Filter out the deleted invoice from the state
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
      alert("Invoice deleted successfully!");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete invoice. Please try again.");
    }
  };

  // Filter invoices based on the search term
  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toString().includes(searchTerm) ||
    invoice.invoiceTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the current invoices to display
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Create pagination numbers with ellipses
  const generatePaginationNumbers = () => {
    const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
    const paginationNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      paginationNumbers.push(i);
    }

    const condensedPagination = [];
    for (let i = 0; i < paginationNumbers.length; i++) {
      if (
        i === 0 ||
        i === paginationNumbers.length - 1 ||
        (paginationNumbers[i] >= currentPage - 1 && paginationNumbers[i] <= currentPage + 1)
      ) {
        condensedPagination.push(paginationNumbers[i]);
      } else if (condensedPagination[condensedPagination.length - 1] !== "...") {
        condensedPagination.push("...");
      }
    }

    return condensedPagination;
  };

  const paginationNumbers = generatePaginationNumbers();

  // Export to Excel function
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredInvoices);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
    XLSX.writeFile(wb, "Invoices.xlsx");
  };

  return (
    <div className="view-container">
      <h3>Invoices List</h3>
      <div className="export-container">
        <button onClick={exportToExcel} className="export-btn">
          <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
        </button>
      </div>
      <input
        type="text"
        placeholder="Search by Invoice Number or Customer Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <div className="invoice-table-container">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Invoice Number</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Subtotal</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.map((invoice, index) => (
              <tr key={index}>
                <td>{index + 1 + indexOfFirstInvoice}</td>
                <td>{invoice.invoiceNumber}</td>
                <td>{new Date(invoice.date).toLocaleDateString()}</td>
                <td>{invoice.invoiceTo}</td>
                <td>{invoice.subtotal.toFixed(2)}</td>
                <td>{invoice.totalAmount.toFixed(2)}</td>
                <td>{invoice.paidAmount.toFixed(2)}</td>
                <td>{invoice.balanceAmount.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleView(invoice.id)} className="action-btn view-btn">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button onClick={() => handleEdit(invoice.id)} className="action-btn edit-btn">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(invoice.id)} className="action-btn delete-btn">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="pagination">
        {paginationNumbers.map((number, index) => (
          <button key={index} onClick={() => typeof number === "number" && paginate(number)} className={`page-button ${currentPage === number ? 'active' : ''}`}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewInvoices;
