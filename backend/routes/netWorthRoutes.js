
const express = require('express');
const router = express.Router();
const netWorthController = require('../controllers/netWorthController');
const requireAuth = require('../middleware/requireAuth');


router.use(requireAuth);

router.get('/assets', netWorthController.getAssets);
router.post('/assets', netWorthController.createAsset);
router.delete('/assets/:asset_id', netWorthController.deleteAsset);


router.get('/liabilities', netWorthController.getLiabilities);
router.post('/liabilities', netWorthController.createLiability);
router.delete('/liabilities/:liability_id', netWorthController.deleteLiability);

module.exports = router;
