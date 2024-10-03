// import './App.css';
// import React from 'react';
// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import AddInvoice from './components/add_invoice/addInvoice';
// import Navbar from './components/navbar/navbar';
// import Footer from './components/footer/footer';
// import ViewInvoices from './components/view_invoice/viewInvoices';
// import EditInvoice from './components/edit_invoice/editInvoice';
// import ViewInvoice from './components/view_invoice/viewInvoice';
// import Login from './components/login/login';

// function Layout() {
//   const location = useLocation(); // Get the current route

//   return (
//     <>
//       {/* Conditionally render Navbar and Footer only if the current route is not "/" */}
//       {location.pathname !== "/" && <Navbar />}
      
//       <Routes>
//         <Route path="/add-invoice" element={<AddInvoice />} />
//         <Route path="/view-invoice" element={<ViewInvoices />} />
//         <Route path="/" element={<Login />} />
//         <Route path="/edit-invoice/:id" element={<EditInvoice />} />
//         <Route path="/invoice-view/:id" element={<ViewInvoice />} />
//       </Routes>

//       {/* Conditionally render Footer only if the current route is not "/" */}
//       {location.pathname !== "/" && <Footer />}
//     </>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Layout />
//     </BrowserRouter>
//   );
// }

// export default App;


import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import AddInvoice from './components/add_invoice/addInvoice';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import ViewInvoices from './components/view_invoice/viewInvoices';
import EditInvoice from './components/edit_invoice/editInvoice';
import ViewInvoice from './components/view_invoice/viewInvoice';
import Login from './components/login/login';
import ProtectedRoute from './components/protectedRoute'; // Import the ProtectedRoute component

function Layout() {
  const location = useLocation(); // Get the current route

  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem('authToken') !== null;

  return (
    <>
      {/* Conditionally render Navbar and Footer only if the user is authenticated */}
      {isAuthenticated && location.pathname !== "/" && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Wrap protected routes with the ProtectedRoute component */}
        <Route path="/add-invoice" element={<ProtectedRoute element={<AddInvoice />} />} />
        <Route path="/view-invoice" element={<ProtectedRoute element={<ViewInvoices />} />} />
        <Route path="/edit-invoice/:id" element={<ProtectedRoute element={<EditInvoice />} />} />
        <Route path="/invoice-view/:id" element={<ProtectedRoute element={<ViewInvoice />} />} />

        {/* Catch all other routes and redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Conditionally render Footer only if the user is authenticated */}
      {isAuthenticated && location.pathname !== "/" && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
