const express = require('express');
const router = express.Router();

const {
  getAll,
  getById,
  create,
  del,
  update,
} = require('../../../controllers/contacts.js');
const guard = require('../../../helpers/guard.js');

const {
  validationAddContact,
  validationUpdateContact,
  validationUpdateContactFavoriteStatus,
} = require('./validation.js');

router.get('/', guard, getAll);

router.get('/:contactId', guard, getById);

router.post('/', guard, validationAddContact, create);

router.delete('/:contactId', guard, del);

router.put('/:contactId', guard, validationUpdateContact, update);

router.patch(
  '/:contactId/favorite',
  guard,
  validationUpdateContactFavoriteStatus,
  update,
);

module.exports = router;
