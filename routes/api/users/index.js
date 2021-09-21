const express = require('express');

const {
  signup,
  login,
  logout,
  current,
  subscription,
  avatar,
  verification,
} = require('../../../controllers/users.js');
const asyncWrapper = require('../../../helpers/async-wrapper.js');

const guard = require('../../../helpers/guard.js');
const uploadImg = require('../../../helpers/upload-img.js');

const {
  validationUser,
  validationUpdateSubscriptionUser,
} = require('./validation.js');

const router = express.Router();

router.post('/signup', validationUser, asyncWrapper(signup));
router.post('/login', validationUser, asyncWrapper(login));
router.post('/logout', guard, asyncWrapper(logout));
router.get('/current', guard, asyncWrapper(current));
router.patch(
  '/',
  guard,
  validationUpdateSubscriptionUser,
  asyncWrapper(subscription),
);
router.patch(
  '/avatars',
  guard,
  uploadImg.single('avatar'),
  asyncWrapper(avatar),
);
router.get('/verify/:verificationToken', asyncWrapper(verification));

module.exports = router;
