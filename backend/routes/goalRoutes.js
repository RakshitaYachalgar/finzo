const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/', goalController.getGoals);

router.post('/', goalController.createGoal);

router.put('/:goal_id', goalController.updateGoal);

router.delete('/:goal_id', goalController.deleteGoal);

module.exports = router;
