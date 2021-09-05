const express = require('express');

const {
  signup,
  login,
  logout,
  current,
  subscription,
} = require('../../../controllers/users.js');

const guard = require('../../../helpers/guard.js');

const {
  validationUser,
  validationUpdateSubscriptionUser,
} = require('./validation.js');

const router = express.Router();

router.post('/signup', validationUser, signup);
router.post('/login', validationUser, login);
router.post('/logout', guard, logout);
router.get('/current', guard, current);
router.patch('/', guard, validationUpdateSubscriptionUser, subscription);

module.exports = router;
