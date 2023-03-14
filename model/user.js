const {Sequelize} = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('User',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    isPremiumUser:Sequelize.BOOLEAN,
});

module.exports = User;