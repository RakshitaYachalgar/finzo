const express = require('express');
const router = express.Router();
const multer = require('multer');
const transactionController = require('../controllers/transactionController');
const requireAuth = require('../middleware/requireAuth');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(requireAuth);

router.post('/upload', upload.single('file'), transactionController.uploadTransactions);
router.post('/add', transactionController.addTransaction);
router.get('/summary', transactionController.getSummary);
router.get('/history', transactionController.getHistory);
router.get('/predict', transactionController.getPrediction);

router.post('/recommend_budget', transactionController.analyzeBudget); 

router.get('/anomalies', transactionController.detectAnomalies);
router.get('/report', transactionController.generateReport);

module.exports = router;

