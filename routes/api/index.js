const express = require('express');
const router = express.Router();
const users = require('./users');
const contacts = require('./contacts');

router.use('/users', users);
router.use('/contacts', contacts);

module.exports = router;
