const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, name: {
        type: DataTypes.STRING,
        allowNull: false
    }, email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, year: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, age: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, cgpa: {
        type: DataTypes.FLOAT,
        allowNull: false
    }, password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'student'
})

module.exports = Student;