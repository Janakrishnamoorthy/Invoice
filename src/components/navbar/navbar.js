import React from "react";
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate to programmatically navigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faFileInvoiceDollar, faCogs, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Toggle menu for responsive design
  const toggleMenu = () => {
    const navLinks = document.querySelector(".nav-links");
    navLinks.classList.toggle("active");
  };

  // Handle Logout
  const handleLogout = () => {
    // Remove the token from localStorage (or session storage)
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h2>INVOICE SYSTEM</h2>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <ul className="nav-links">
        <li><Link to="/add-invoice"><FontAwesomeIcon icon={faHome} />Home</Link></li>
        <li><Link to="/view-invoice"><FontAwesomeIcon icon={faFileInvoiceDollar} />Invoices</Link></li>
        <li><Link to="/add-invoice"><FontAwesomeIcon icon={faCogs} />Settings</Link></li>
        {/* Attach the logout handler to the Logout link */}
        <li><Link onClick={handleLogout} style={{ cursor: 'pointer' }}><FontAwesomeIcon icon={faSignOutAlt} />Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
