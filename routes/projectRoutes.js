const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/company-post-projects', projectController.renderPostProject);
router.post('/company-post-project', projectController.postProject);
router.get('/company-manage-projects', projectController.manageProjects);
router.get('/company-recommendations', projectController.companyRecommendations);

module.exports = router;