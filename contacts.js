const fs = require('fs').promises;
const path = require('path');
const contactsPath = path.normalize('./db/contacts.json');

const updatedInd = data =>
  data.map((el, ind) => {
    return {
      ...el,
      id: ind + 1,
    };
  });

const list = async () => {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath, 'utf-8'));
    return data;
  } catch (err) {
    console.error(err.message);
  }
};

async function listContacts() {
  try {
    console.table(await list());
  } catch (err) {
    console.error(err.message);
  }
}

async function getContactById(contactId) {
  try {
    let obj = { message: 'No such contact!' };
    const data = await list();
    data.find(item => {
      if (item.id === contactId) {
        obj = item;
      }
    });
    console.table(obj);
  } catch (err) {
    console.error(err.message);
  }
}

async function removeContact(contactId) {
  try {
    const data = await list();
    const getVisibleContacts = data.filter(item =>
      item.id === contactId
        ? console.table({ message: `${item.name} contact deleted` })
        : item.id !== contactId,
    );

    const updatedData = updatedInd(getVisibleContacts);
    fs.writeFile(contactsPath, JSON.stringify(updatedData, null, 2), err => {
      if (err) return err.message;
    });

    console.log('Contact list updated');
    console.table(updatedData);
  } catch (err) {
    console.error(err.message);
  }
}

async function addContact({ name, email, phone }) {
  try {
    const contact = { name, email, phone };
    const data = await list();
    data.push({ id: data.length + 1, ...contact });

    const updatedData = updatedInd(data);
    console.table({ Contact: `Add contact ${name}` });
    fs.writeFile(contactsPath, JSON.stringify(updatedData, null, 2), err => {
      if (err) return err.message;
    });
    console.log('Contact list updated');
    console.table(updatedData);
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
