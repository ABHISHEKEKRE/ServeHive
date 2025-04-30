const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const protectRoutes = require('../middleware/protectRoutes');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
router.get('/company-post-projects', protectRoutes, projectController.renderPostProject);
router.post('/company-post-project', protectRoutes,projectController.postProject);
router.get('/company-manage-projects', protectRoutes, projectController.manageProjects);
router.get('/company-recommendations',  protectRoutes,projectController.companyRecommendations);

module.exports = router;
