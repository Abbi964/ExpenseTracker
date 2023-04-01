const {Sequelize,DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const FileUrl = sequelize.define('fileUrl',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    url:DataTypes.STRING
})

module.exports = FileUrl