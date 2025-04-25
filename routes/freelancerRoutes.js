const express = require('express');
const router = express.Router();
const freelancerController = require('../controllers/freelancerController');

router.get('/freelancer-login', (req, res) => res.render('freelancer-login', { errors: [] }));
router.post('/freelancer-signup', freelancerController.freelancerSignup);
router.post('/freelancer-login', freelancerController.freelancerLogin);
router.get('/freelancer-logout', freelancerController.freelancerLogout);
router.get('/freelancer-dashboard', freelancerController.renderFreelancerDashboard);
router.get('/freelancer-bidding', freelancerController.renderFreelancerBidding);
router.get('/freelancer-communications', freelancerController.renderFreelancerCommunications);
router.get('/freelancer-reviews', freelancerController.renderFreelancerReviews);
router.get('/freelancer-task-management', freelancerController.renderFreelancerTaskManagement);
router.get('/freelancer-payments', freelancerController.renderFreelancerPayments);
router.get('/freelancer-notifications', freelancerController.renderFreelancerNotifications);
router.get('/freelancer-help', freelancerController.renderFreelancerHelp);
router.get('/freelancer-settings', freelancerController.renderFreelancerSettings);
router.get('/freelancer-profile', freelancerController.renderFreelancerProfile);
router.post('/freelancer-profile-submit',freelancerController.renderFreelancerProfileUpdates);

module.exports = router;
