const path = require('path');

const bodyParser = require('body-parser')

const express = require('express');
const app = express();

const sequelize = require('./util/database')

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')

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

sequelize.sync();

app.listen(3000);

