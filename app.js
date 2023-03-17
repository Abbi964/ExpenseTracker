require('dotenv').config()

const path = require('path');

const bodyParser = require('body-parser')

const express = require('express');
const app = express();

const sequelize = require('./util/database')

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const orderRoutes = require('./routes/order');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password')

const User = require('./model/user');
const Expense = require('./model/expense');
const Order = require('./model/order')
const ForgotPasswordRequest = require('./model/ForgotPasswordRequest')

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
app.use('/premium',premiumRoutes);
app.use('/password',passwordRoutes);


// defining relation between user and expense
User.hasMany(Expense);
Expense.belongsTo(User);

// defining relation between User and Order
User.hasMany(Order);
Order.belongsTo(User);

// defining relation between User and ForgotPasswordRequest
User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

sequelize.sync();

app.listen(3000);

