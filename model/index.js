require('dotenv').config();

const Contact = require('./contact');

const listContacts = async () => {
  const result = await Contact.find();
  return result;
};

const getContactById = async contactId => {
  const contactById = await Contact.findOne({ _id: contactId });
  return contactById;
};

const addContact = async body => {
  const result = await Contact.create(body);
  return result;
};

const removeContact = async contactId => {
  const deleteContact = await Contact.findOneAndRemove({
    _id: contactId,
  });
  if (deleteContact) {
    return { message: 'contact deleted' };
  }
  return '';
};

const updateContact = async (contactId, body) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId },
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
