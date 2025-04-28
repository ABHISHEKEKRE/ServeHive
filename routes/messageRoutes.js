const express= require('express');
const router =express.Router();
const messageController=require('../controllers/messageController')
const protectRoutes =require('../middleware/protectRoutes')

router.get("/:id",protectRoutes,messageController.getMessages)
router.post('/send/:id',protectRoutes,(req, res, next) => {
    // Verify CSRF token
    if (!req.csrfToken()) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    next();
  },messageController.sendMessage);
module.exports= router;
