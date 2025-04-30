const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/company-post-projects', protectRoutes, projectController.renderPostProject);
router.post('/company-post-project', protectRoutes,projectController.postProject);
router.get('/company-manage-projects', protectRoutes, projectController.manageProjects);
router.get('/company-recommendations',  protectRoutes,projectController.companyRecommendations);

module.exports = router;
