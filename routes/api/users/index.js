const express = require('express');

const {
  signup,
  login,
  logout,
  current,
} = require('../../../controllers/users.js');
const guard = require('../../../helpers/guard.js');
const { validationUser } = require('./validation.js');
const router = express.Router();

router.post('/signup', validationUser, signup);
router.post('/login', validationUser, login);
router.post('/logout', guard, logout);
router.get('/current', guard, current);

module.exports = router;
