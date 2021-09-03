require('dotenv').config();

const Contact = require('../model/contact');

const listContacts = async (userId, query) => {
  const { limit = 20, page = 1, sortBy, sortByDesc, favorite } = query;
  const options =
    typeof favorite === 'boolean'
      ? { owner: userId, favorite }
      : { owner: userId };
  const result = await Contact.paginate(options, {
    page,
    limit,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
  });
  return result;
};

const getContactById = async (userId, contactId) => {
  return await Contact.findOne({ _id: contactId, owner: userId });
};

const addContact = async (userId, body) => {
  return await Contact.create({ ...body, owner: userId });
};

const removeContact = async (userId, contactId) => {
  const deleteContact = await Contact.findOneAndRemove({
    _id: contactId,
    owner: userId,
  });
  if (deleteContact) {
    return { message: 'contact deleted' };
  }
  return '';
};

const updateContact = async (userId, contactId, body) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true },
  );
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
