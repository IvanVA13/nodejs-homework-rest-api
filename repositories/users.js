require('dotenv').config();

const User = require('../model/user');

const listUsers = async () => {
  return await User.find();
};

const getUserById = async userId => {
  return await User.findById(userId);
};

const getUserByEmail = async email => {
  return await User.findOne({ email });
};

const addUser = async body => {
  return await User.create(body);
};

const updateUserToken = async (userId, token) => {
  return await User.updateOne({ _id: userId }, { token });
};

const updateSubscription = async (userId, body) => {
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { ...body },
    { new: true },
  );
  return user;
};

module.exports = {
  listUsers,
  getUserById,
  getUserByEmail,
  addUser,
  updateUserToken,
  updateSubscription,
};
