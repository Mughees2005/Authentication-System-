const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Student = require('./student')(sequelize, DataTypes)

sequelize.sync()
  .then(() => console.log("Tables created"))
  .catch(err => console.log(err))

module.exports = { sequelize, Student }
