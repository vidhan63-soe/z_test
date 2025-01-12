const express = require('express');
const { CustomerDetails } = require('../models');
const router = express.Router();

// Create customer details
router.post('/:customerID', async (req, res) => {
    try {
        const customerDetails = await CustomerDetails.create({
            ...req.body,
            customerID: req.params.customerID
        });
        res.status(201).json(customerDetails);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
