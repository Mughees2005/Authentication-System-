// const sequelize = require('../config/db');
// const User = require('./user.model')


// // sync all models
// async function syncAll() {
//     try{
//         await sequelize.sync();
//         console.log('All tables synced with relationships');
//     }catch (error){
//         console.error('Sync error:', error.message)
//     }
// }

// module.exports = { User }


const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Student = require('./student')(sequelize, DataTypes)

sequelize.sync()
  .then(() => console.log("Tables created"))
  .catch(err => console.log(err))

module.exports = { sequelize, Student }
