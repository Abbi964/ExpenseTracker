const orderController = require('../controller/order')
const userAuthenticaltion = require('../middleware/auth')

const express = require('express');

const router = express.Router();

router.get('/purchasePremium',userAuthenticaltion.authenticate,orderController.purchasePremium)

router.post('/updateTransectionStatus',userAuthenticaltion.authenticate,orderController.updateTransection);

router.post('/transectionFalied',userAuthenticaltion.authenticate,orderController.transectionFailed)

module.exports = router;