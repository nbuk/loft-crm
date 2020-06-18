var express = require('express');
var router = express.Router();
const authCtrl = require('../controllers/authController');

router.post('/api/registration', authCtrl.registration);
router.post('/api/login', authCtrl.login);

module.exports = router;
