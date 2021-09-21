const { NotFound } = require('http-errors');

const { httpCode, message, statusCode } = require('../helpers/constants.js');
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../repositories/contacts.js');

const getAll = async (req, res) => {
  const {
    user: { id: userId },
    query,
  } = req;
  const { docs: contacts, ...page } = await listContacts(userId, query);

  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: {
      page,
      contacts: contacts.filter(contact =>
        query.favorite ? contact.favorite : contact,
      ),
    },
  });
};

const getById = async (req, res) => {
  const {
    user: { id: userId },
    params: { contactId },
  } = req;
  const contact = await getContactById(userId, contactId);
  if (contact) {
    return res.json({
      status: statusCode.SUCCESS,
      code: httpCode.OK,
      data: {
        contact,
      },
    });
  }
  throw new NotFound(message.NOT_FOUND);
};

const create = async (req, res) => {
  const {
    user: { id: userId },
    body: { phone, ...rest },
  } = req;
  if (req.body) {
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
};

const del = async (req, res) => {
  const {
    user: { id: userId },
    params: { contactId },
  } = req;
  const message = await removeContact(userId, contactId);
  if (message) {
    return res.json({
      status: statusCode.SUCCESS,
      code: httpCode.OK,
      data: {
        message,
      },
    });
  }
  throw new NotFound(message.NOT_FOUND);
};

const update = async (req, res) => {
  const {
    user: { id: userId },
    params: { contactId },
    body,
  } = req;
  const contact = await updateContact(userId, contactId, body);
  if (contact) {
    return res.json({
      status: statusCode.SUCCESS,
      code: httpCode.OK,
      data: {
        contact,
      },
    });
  }
  throw new NotFound(message.NOT_FOUND);
};

module.exports = {
  getAll,
  getById,
  create,
  del,
  update,
};
