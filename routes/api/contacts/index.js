const express = require('express');
const router = express.Router();

const {
  getAll,
  getById,
  create,
  del,
  update,
} = require('../../../controllers/contacts.js');
const asyncWrapper = require('../../../helpers/async-wrapper.js');
const guard = require('../../../helpers/guard.js');

const {
  validationAddContact,
  validationUpdateContact,
  validationUpdateContactFavoriteStatus,
} = require('./validation.js');

router.get('/', guard, asyncWrapper(getAll));

router.get('/:contactId', guard, asyncWrapper(getById));

router.post('/', guard, validationAddContact, asyncWrapper(create));

router.delete('/:contactId', guard, asyncWrapper(del));

router.put('/:contactId', guard, validationUpdateContact, asyncWrapper(update));

router.patch(
  '/:contactId/favorite',
  guard,
  validationUpdateContactFavoriteStatus,
  asyncWrapper(update),
);

module.exports = router;
