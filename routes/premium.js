const premiumController = require('../constroller/premium')

const express = require('express');

const router = express.Router();

router.get('/getLeaderboard',premiumController.getLeaderboard);

module.exports  = router