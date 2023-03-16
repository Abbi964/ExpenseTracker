const sequelize = require('../util/database')

const Razorpay = require('razorpay');

const Order = require('../model/order')

exports.purchasePremium = (req, res, next) => {
    try {
        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })
        const amount = 2500;
        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                throw (err);
            }
            else {
                // using magic methods
                req.user.createOrder({ orderId: order.id, status: 'PENDING' })
                    .then(() => {
                        res.status(201).json({ order, key_id: rzp.key_id })
                    })
            }
        })
    }
    catch (err) {

    }
}

exports.updateTransection = async (req, res, next) => {
    const t = await sequelize.transaction()
    try {
        // we have to update the Order table and also user table
        //first usertable
        req.user.update({ isPremiumUser: true }, { transection: t })
        // now ordertable
        let order = await Order.findOne({
            where: { orderId: req.body.order_id },
            transaction: t,
        })
        order.paymentId = req.body.payment_id;
        order.status = 'SUCCESSFUL';
        await order.save({ transaction: t, })
        await t.commit()
        res.status(202).json('transection successful')
    }
    catch (err) {
        await t.rollback()
        console.log(err);
    }
}

exports.transectionFailed = async (req, res, next) => {
    const t = await sequelize.transaction()
    try {
        let orders = await req.user.getOrders({
            where: { orderId: req.body.order_id },
            transaction:t, 
        })
        await t.commit()
        let order = orders[0]
        order.status = 'FAILED';
        order.save();
    }
    catch(err){
        await t.rollback()
        console.log(err)
    }
}