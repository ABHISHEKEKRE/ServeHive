const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const protectRoutes = require('../middleware/protectRoutes');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
router.get('/place-bid' ,protectRoutes, bidController.placeBid);
router.post('/submit-bid', protectRoutes,  csrfProtection, bidController.submitBid);

module.exports = router;
