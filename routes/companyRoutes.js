const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

router.get('/', (req, res) => res.render('main-landing'));
router.get('/company-login', (req, res) => res.render('company-login', { errors: [] }));
router.post('/company-signup', companyController.companySignup);
router.post('/company-login', companyController.companyLogin);
router.get('/company-logout', companyController.companyLogout);
router.get('/company-dashboard', companyController.renderCompanyDashboard);
router.get('/company-profile', companyController.renderCompanyProfile);
router.get('/company-settings', companyController.renderCompanySettings);
router.get('/company-communications', companyController.renderCompanyCommunications);
router.get('/company-reviews', companyController.renderCompanyReviews);
router.get('/company-payments', companyController.renderCompanyPayments);
router.get('/company-task-management', companyController.renderCompanyTaskManagement);
router.get('/company-notifications', companyController.renderCompanyNotifications);
router.get('/company-support', companyController.renderCompanySupport);

module.exports = router;
