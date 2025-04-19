const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');

router.get('/place-bid', bidController.placeBid);
router.post('/submit-bid', bidController.submitBid);

module.exports = router;