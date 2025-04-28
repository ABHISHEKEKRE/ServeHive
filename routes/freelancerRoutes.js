const express = require('express');
const router = express.Router();
const freelancerController = require('../controllers/freelancerController');
const protectRoutes = require('../middleware/protectRoutes');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
router.get('/freelancer-login', (req, res) => res.render('freelancer-login', { errors: [] }));

router.get('/freelancer-dashboard', protectRoutes,  freelancerController.renderFreelancerDashboard);
router.get('/freelancer-bidding', protectRoutes, freelancerController.renderFreelancerBidding);
router.get('/freelancer-communications', protectRoutes, csrfProtection, freelancerController.renderFreelancerCommunications);
router.get('/freelancer-reviews', protectRoutes, freelancerController.renderFreelancerReviews);
router.get('/freelancer-task-management', protectRoutes,  freelancerController.renderFreelancerTaskManagement);
router.get('/freelancer-payments', protectRoutes,  freelancerController.renderFreelancerPayments);
router.get('/freelancer-notifications', protectRoutes,  freelancerController.renderFreelancerNotifications);
router.get('/freelancer-help', protectRoutes,  freelancerController.renderFreelancerHelp);
router.get('/freelancer-settings', protectRoutes,  freelancerController.renderFreelancerSettings);
router.get('/freelancer-profile', protectRoutes,  freelancerController.renderFreelancerProfile);

// new route for editing company profile
router.post('/freelancer-profile-submit',freelancerController.renderFreelancerProfileUpdates);
module.exports = router;
