const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/company-signup', authController.companySignup);
router.post('/company-login', authController.companyLogin);
router.get('/company-logout', authController.companyLogout);
router.post('/freelancer-login', authController.freelancerLogin);
router.get('/freelancer-logout', authController.freelancerLogout);
router.post('/freelancer-signup', authController.freelancerSignup);

module.exports = router;  // <-- correct spelling
