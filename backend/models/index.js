const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');

// Ensure these models exist before connecting them
if (User && Task) {
    User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Task.belongsTo(User, { foreignKey: 'userId' });
}

module.exports = { sequelize, User, Task };