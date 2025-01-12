const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'yourusername', // Replace with your MySQL username
    password: 'yourpassword', // Replace with your MySQL password
    database: 'customer_management'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

// Create Customer
app.post('/customers', (req, res) => {
    const { firstName, lastName, email } = req.body;
    const sql = 'INSERT INTO customers (firstName, lastName, email) VALUES (?, ?, ?)';
    connection.query(sql, [firstName, lastName, email], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId });
    });
});

// Read Customers
// Read Customers with Details
app.get('/customers', (req, res) => {
    const sql = `
        SELECT c.customerID, c.firstName, c.lastName, c.email, 
               cd.address, cd.phoneNumber 
        FROM customers c 
        LEFT JOIN customer_details cd ON c.customerID = cd.customerID`;
    
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});


// Update Customer
app.put('/customers/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    const sql = 'UPDATE customers SET firstName = ?, lastName = ?, email = ? WHERE customerID = ?';
    connection.query(sql, [firstName, lastName, email, id], (err) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(204);
    });
});

// Delete Customer
app.delete('/customers/:id', (req, res) => {
    const id = req.params.id;

    // Delete from customer_details first
    const deleteDetailsQuery = 'DELETE FROM customer_details WHERE customerID = ?';
    connection.query(deleteDetailsQuery, [id], (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Now delete from customers
        const deleteCustomerQuery = 'DELETE FROM customers WHERE customerID = ?';
        connection.query(deleteCustomerQuery, [id], (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.sendStatus(204); // No Content
        });
    });
});

// Add Customer Details
app.post('/customer_details', (req, res) => {
    const { customerID, address, phoneNumber } = req.body;
    const sql = 'INSERT INTO customer_details (customerID, address, phoneNumber) VALUES (?, ?, ?)';
    
    connection.query(sql, [customerID, address, phoneNumber], (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: 'Customer details added successfully' });
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
