const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '../.env'),
});
const router = require('express').Router();
const passport = require('../helpers/passport');

const authCtrl = require('../controllers/authController');
const profileCtrl = require('../controllers/profileController');
const usersCtrl = require('../controllers/usersController');
const newsCtrl = require('../controllers/newsController');

router.get(
    '/secret',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        console.log('TEST');
        res.send('asdasdasdas');
    },
);

router.post('/api/registration', authCtrl.registration);
router.post('/api/login', authCtrl.login);
router.post(
    '/api/refresh-token',
    passport.authenticate('jwt', { session: false }),
    authCtrl.refreshToken,
);

router.get(
    '/api/profile',
    passport.authenticate('jwt', { session: false }),
    profileCtrl.get,
);
router.patch(
    '/api/profile',
    passport.authenticate('jwt', { session: false }),
    profileCtrl.patch,
);

router.get(
    '/api/users',
    passport.authenticate('jwt', { session: false }),
    usersCtrl.get,
);
router.patch(
    '/api/users/:id/permission',
    passport.authenticate('jwt', { session: false }),
    usersCtrl.patch,
);
router.delete(
    '/api/users/:id',
    passport.authenticate('jwt', { session: false }),
    usersCtrl.delete,
);

router.get('/api/news', newsCtrl.get);
router.post('/api/news', newsCtrl.post);
router.patch('/api/news/:id', newsCtrl.patch);
router.delete('/api/news/:id', newsCtrl.delete);

module.exports = router;
