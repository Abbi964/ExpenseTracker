require('dotenv').config()

const path = require('path');

const bodyParser = require('body-parser')

const express = require('express');
const app = express();

const sequelize = require('./util/database')

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const orderRoutes = require('./routes/order')

const User = require('./model/user');
const Expense = require('./model/expense');
const Order = require('./model/order')

// making public static
app.use(express.static(path.join(__dirname,'public')));
// adding body parser
app.use(bodyParser.json());

// redirecting get req on '/' to sign up page
app.get('/',(req,res,next)=>{
    res.redirect('/user/signup')
})

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/order',orderRoutes);

// defining relation between user and expense
User.hasMany(Expense);
Expense.belongsTo(User);

// defining relation between User and Order
User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync();

app.listen(3000);

