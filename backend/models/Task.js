const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
    title: { type: DataTypes.STRING, allowNull: false },
    status: { 
        type: DataTypes.ENUM('Pending', 'Completed'), 
        defaultValue: 'Pending' 
    }
});

module.exports = Task;