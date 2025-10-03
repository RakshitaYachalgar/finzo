const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/', profileController.getProfile);

router.put('/', profileController.updateProfile);

module.exports = router;
