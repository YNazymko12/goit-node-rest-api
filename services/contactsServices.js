import Contact from '../db/models/Contact.js';

export const getContacts = query =>
  Contact.findAll({
    where: query,
  });

export const getContactById = ({ id, owner }) =>
  Contact.findOne({
    where: { id, owner },
  });

export const getContact = query =>
  Contact.findOne({
    where: query,
  });

export const addContact = data => Contact.create(data);

export const updateContact = async ({ id, owner }, data) => {
  const contact = await getContactById({ id, owner });
  if (!contact) return null;

  return contact.update(data, { returning: true });
};

export const deleteContact = async ({ id, owner }) => {
  const contact = await getContactById({ id, owner });
  if (!contact) return null;

  await contact.destroy();
  return contact;
};

export const updateStatusContact = async ({ id, owner }, { favorite }) => {
  const contact = await getContactById({ id, owner });
  if (!contact) return null;

  return contact.update({ favorite }, { returning: true });
};
