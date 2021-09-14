const express = require('express');

const {
  signup,
  login,
  logout,
  current,
  subscription,
  avatar,
} = require('../../../controllers/users.js');

const guard = require('../../../helpers/guard.js');
const uploadImg = require('../../../helpers/upload-img.js');

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
router.patch('/avatars', guard, uploadImg.single('avatar'), avatar);

module.exports = router;
