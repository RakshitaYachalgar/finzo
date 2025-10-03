const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/', budgetController.getBudgets);

router.post('/', budgetController.setBudgets);

module.exports = router;
