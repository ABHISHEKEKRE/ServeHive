const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const protectRoutes = require('../middleware/protectRoutes');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.get('/', (req, res) => res.render('main-landing'));
router.get('/company-login', (req, res) => res.render('company-login', { errors: [] }));
router.get('/company-dashboard', protectRoutes, companyController.renderCompanyDashboard);
router.get('/company-profile', protectRoutes, companyController.renderCompanyProfile);
router.get('/company-settings', protectRoutes, companyController.renderCompanySettings);
router.get('/company-communications', protectRoutes, csrfProtection, companyController.renderCompanyCommunications);
router.get('/company-reviews', protectRoutes, companyController.renderCompanyReviews);
router.get('/company-payments', protectRoutes, companyController.renderCompanyPayments);
router.get('/company-task-management', protectRoutes, companyController.renderCompanyTaskManagement);
router.get('/company-notifications', protectRoutes, companyController.renderCompanyNotifications);
router.get('/company-support', protectRoutes, companyController.renderCompanySupport);
router.post('/company-profile-submit', protectRoutes, companyController.renderCompanyProfileUpdates);

module.exports = router;
