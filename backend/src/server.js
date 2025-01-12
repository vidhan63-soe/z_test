const express = require('express');
const { sequelize } = require('./models');
const customerRoutes = require('./routes/customerRoutes');
const customerDetailsRoutes = require('./routes/customerDetailsRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/customers', customerRoutes);
app.use('/customer-details', customerDetailsRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}).catch(error => console.error('Unable to connect to the database:', error));
