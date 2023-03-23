const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const Income = sequelize.define('income',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false,
    },
})

module.exports = Income;