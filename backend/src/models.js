const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('customerDB', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

const Customer = sequelize.define('Customer', {
    customerID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

const CustomerDetails = sequelize.define('CustomerDetails', {
    detailID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customerID: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'customerID'
        }
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = { Customer, CustomerDetails, sequelize };
