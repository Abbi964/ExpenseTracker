const { Sequelize,DataTypes } = require("sequelize");

const  sequelize = require('../util/database');

const ForgotPasswordRequest = sequelize.define('ForgotPasswordRequest',{
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    isActive: DataTypes.BOOLEAN,
})

module.exports = ForgotPasswordRequest;