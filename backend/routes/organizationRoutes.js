const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);


router.post('/', organizationController.createOrganization);

router.post('/invite', organizationController.inviteUser);

router.get('/members', organizationController.getMembers);

module.exports = router;
