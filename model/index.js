const fs = require('fs/promises');
const path = require('path');
const { v4: idGen } = require('uuid');

const contactsPath = path.join(__dirname, '/contacts.json');

const readData = async () => {
  const data = await fs.readFile(contactsPath, 'utf8');
  return JSON.parse(data);
};

const listContacts = async () => {
  return await readData();
};

const getContactById = async contactId => {
  const data = await readData();
  const contactById = data.find(({ id }) => id.toString() === contactId);
  return contactById;
};

const addContact = async body => {
  const data = await readData();
  const id = idGen();
  const newContact = {
    id,
    ...body,
  };
  await data.push(newContact);
  await fs.writeFile(contactsPath, `${JSON.stringify(data, null, 2)}`);
  return newContact;
};

const removeContact = async contactId => {
  const data = await readData();
  const deleteContact = data.find(({ id }) => id.toString() === contactId);
  if (deleteContact) {
    const contacts = data.filter(({ id }) => id.toString() !== contactId);
    await fs.writeFile(contactsPath, `${JSON.stringify(contacts, null, 2)}`);
    return { message: 'contact deleted' };
  }
  return '';
};

const updateContact = async (contactId, body) => {
  const data = await readData();
  const contact = data.find(({ id }) => id.toString() === contactId);
  if (contact) {
    Object.assign(contact, body);
    await fs.writeFile(contactsPath, `${JSON.stringify(data, null, 2)}`);
  }
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
