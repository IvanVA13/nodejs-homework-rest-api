const express = require('express');

const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../../model');

const {
  validationAddContact,
  validationUpdateContact,
} = require('./validation');

router.get('/', async (_, res, next) => {
  try {
    const contacts = await listContacts();
    return res.json({
      status: 'success',
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      });
    }
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Not found :(',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', validationAddContact, async (req, res, next) => {
  try {
    if (req.body) {
      const newContact = await addContact(req.body);
      return res.status(201).json({
        status: 'success',
        code: 201,
        data: {
          newContact,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const message = await removeContact(req.params.contactId);
    if (message) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          message,
        },
      });
    }
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Not found :(',
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', validationUpdateContact, async (req, res, next) => {
  try {
    const contact = await updateContact(req.params.contactId, req.body);
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      });
    }
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Not found :(',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
