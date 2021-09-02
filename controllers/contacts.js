const { httpCode, message, statusCode } = require('../helpers/constants.js');
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../repositories/contacts.js');

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await listContacts(userId);
    return res.json({
      status: statusCode.SUCCESS,
      code: httpCode.OK,
      data: {
        contacts,
      },
    });
  } catch (error) {
    next(error.message);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await getContactById(userId, req.params.contactId);
    if (contact) {
      return res.json({
        status: statusCode.SUCCESS,
        code: httpCode.OK,
        data: {
          contact,
        },
      });
    }
    return res.status(httpCode.NOT_FOUND).json({
      status: statusCode.ERROR,
      code: httpCode.NOT_FOUND,
      message: message.NOT_FOUND,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    if (req.body) {
      const userId = req.user.id;
      const newContact = await addContact(userId, req.body);
      return res.status(httpCode.CREATED).json({
        status: statusCode.SUCCESS,
        code: httpCode.CREATED,
        data: {
          newContact,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const del = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const message = await removeContact(userId, req.params.contactId);
    if (message) {
      return res.json({
        status: statusCode.SUCCESS,
        code: httpCode.OK,
        data: {
          message,
        },
      });
    }
    return res.status(httpCode.NOT_FOUND).json({
      status: statusCode.ERROR,
      code: httpCode.NOT_FOUND,
      message: message.NOT_FOUND,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await updateContact(userId, req.params.contactId, req.body);
    if (contact) {
      return res.json({
        status: statusCode.SUCCESS,
        code: httpCode.OK,
        data: {
          contact,
        },
      });
    }
    return res.status(httpCode.NOT_FOUND).json({
      status: statusCode.ERROR,
      code: httpCode.NOT_FOUND,
      message: message.NOT_FOUND,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  del,
  update,
};
