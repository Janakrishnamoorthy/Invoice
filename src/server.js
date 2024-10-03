const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");  // Import the MySQL connection from db.js
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint to store invoice data
app.post("/add-invoice", (req, res) => {
  const {
    date,
    invoiceNumber,
    invoiceTo,
    customerGST,
    subtotal,
    cgst,
    sgst,
    totalAmount,
    paidAmount,
    balanceAmount,
    items
  } = req.body;

  const insertInvoiceQuery = `
    INSERT INTO invoices 
    (date, invoiceNumber, invoiceTo, customerGST, subtotal, cgst, sgst, totalAmount, paidAmount, balanceAmount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(insertInvoiceQuery, [date, invoiceNumber, invoiceTo, customerGST, subtotal, cgst, sgst, totalAmount, paidAmount, balanceAmount], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error saving invoice", error: err });
    }

    const invoiceId = result.insertId;

    // Insert items related to this invoice
    const insertItemQuery = `INSERT INTO invoice_items (invoice_id, item, price, qty, total) VALUES ?`;
    const itemValues = items.map(item => [invoiceId, item.item, item.price, item.qty, item.total]);

    db.query(insertItemQuery, [itemValues], (err) => {
      if (err) {
        return res.status(500).send({ message: "Error saving invoice items", error: err });
      }

      res.status(200).send({ message: "Invoice saved successfully" });
    });
  });
});

// Endpoint to retrieve all invoices with their items
app.get("/invoices", (req, res) => {
    const queryInvoices = `SELECT * FROM invoices`;
  
    db.query(queryInvoices, (err, invoices) => {
      if (err) {
        return res.status(500).send({ message: "Error fetching invoices", error: err });
      }
  
      const invoiceIds = invoices.map(invoice => invoice.id);
  
      if (invoiceIds.length > 0) {
        const queryItems = `SELECT * FROM invoice_items WHERE invoice_id IN (?)`;
        db.query(queryItems, [invoiceIds], (err, items) => {
          if (err) {
            return res.status(500).send({ message: "Error fetching invoice items", error: err });
          }
  
          const invoiceData = invoices.map(invoice => ({
            ...invoice,
            items: items.filter(item => item.invoice_id === invoice.id),
          }));
  
          res.status(200).send(invoiceData);
        });
      } else {
        res.status(200).send([]);
      }
    });
  });
  
  // DELETE endpoint for deleting an invoice
app.delete('/invoices/:id', (req, res) => {
    const invoiceId = req.params.id;
  
    const query = 'DELETE FROM invoices WHERE id = ?';
    db.query(query, [invoiceId], (err, result) => {
      if (err) {
        console.error('Error deleting invoice:', err);
        return res.status(500).json({ message: 'Error deleting invoice' });
      }
      res.status(200).json({ message: 'Invoice deleted successfully' });
    });
  });
  
//Edit Call endpoint
  app.get("/invoices/:id", (req, res) => {
    const { id } = req.params;
  
    const queryInvoice = "SELECT * FROM invoices WHERE id = ?";
    const queryItems = "SELECT * FROM invoice_items WHERE invoice_id = ?";
  
    db.query(queryInvoice, [id], (err, invoices) => {
      if (err) return res.status(500).send({ message: "Error fetching invoice", error: err });
  
      if (invoices.length === 0) return res.status(404).send({ message: "Invoice not found" });
  
      db.query(queryItems, [id], (err, items) => {
        if (err) return res.status(500).send({ message: "Error fetching invoice items", error: err });
  
        const invoiceData = { ...invoices[0], items };
        res.status(200).send(invoiceData);
      });
    });
  });

//Update endpoint for db 
  app.put("/invoices/:id", (req, res) => {
    const { id } = req.params;
    const { date, invoiceNumber, invoiceTo, customerGST, subtotal, cgst, sgst, totalAmount, paidAmount, balanceAmount, items } = req.body;
  
    const updateInvoiceQuery = `
      UPDATE invoices 
      SET date = ?, invoiceNumber = ?, invoiceTo = ?, customerGST = ?, subtotal = ?, cgst = ?, sgst = ?, totalAmount = ?, paidAmount = ?, balanceAmount = ?
      WHERE id = ?
    `;
  
    db.query(updateInvoiceQuery, [date, invoiceNumber, invoiceTo, customerGST, subtotal, cgst, sgst, totalAmount, paidAmount, balanceAmount, id], (err) => {
      if (err) return res.status(500).send({ message: "Error updating invoice", error: err });
  
      const deleteItemsQuery = "DELETE FROM invoice_items WHERE invoice_id = ?";
      db.query(deleteItemsQuery, [id], (err) => {
        if (err) return res.status(500).send({ message: "Error deleting old invoice items", error: err });
  
        const insertItemsQuery = `
          INSERT INTO invoice_items (invoice_id, item, price, qty, total)
          VALUES ?
        `;
        const itemsData = items.map((item) => [id, item.item, item.price, item.qty, item.total]);
  
        db.query(insertItemsQuery, [itemsData], (err) => {
          if (err) return res.status(500).send({ message: "Error inserting new invoice items", error: err });
  
          res.status(200).send({ message: "Invoice updated successfully" });
        });
      });
    });
  });


  // Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const findAdminQuery = 'SELECT * FROM admin WHERE email = ?';

  db.query(findAdminQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).send({ message: 'Server error', error: err });
    }

    if (results.length === 0) {
      return res.status(401).send({ success: false, message: 'Email not found' });
    }

    const user = results[0];

    // Compare the hashed password with the entered password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).send({ message: 'Error comparing passwords', error: err });
      }

      if (!isMatch) {
        return res.status(401).send({ success: false, message: 'Invalid credentials' });
      }

      // If password matches, login successful
      res.status(200).send({ success: true, message: 'Login successful' });
    });
  });
});



// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
