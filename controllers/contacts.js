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
    const { docs: contacts, ...page } = await listContacts(userId, req.query);

    return res.json({
      status: statusCode.SUCCESS,
      code: httpCode.OK,
      data: {
        page,
        contacts: contacts.filter(contact =>
          req.query.favorite ? contact.favorite : contact,
        ),
      },
    });
  } catch (err) {
    next(err.message);
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
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    if (req.body) {
      const userId = req.user.id;
      const { phone, ...rest } = req.body;
      const newContact = await addContact(userId, {
        ...rest,
        phone: await phone.replace(
          /([0-9]{3})([0-9]{3})([0-9]{4})/,
          '($1) $2-$3',
        ),
      });
      return res.status(httpCode.CREATED).json({
        status: statusCode.SUCCESS,
        code: httpCode.CREATED,
        data: {
          newContact,
        },
      });
    }
  } catch (err) {
    next(err);
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
  } catch (err) {
    next(err);
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
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  del,
  update,
};
