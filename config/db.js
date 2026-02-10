const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('student_db', 'postgres', '316618', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5440,
    logging: false
});

module.exports = sequelize;