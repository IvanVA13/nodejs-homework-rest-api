const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const { NotFound, Conflict, Unauthorized } = require('http-errors');
const fs = require('fs/promises');

require('dotenv').config();
const { SECRET_KEY, USERS_AVATARS, NODE_ENV } = process.env;

const { httpCode, message, statusCode } = require('../helpers/constants.js');
const {
  getUserByEmail,
  addUser,
  updateUserToken,
  updateSubscription,
  updateUserAvatar,
  getUserByVerifyToken,
  updateUserVerification,
} = require('../repositories/users.js');
const SenderVerifyEmailToUser = require('../services/email-verify.js');
const { createSenderSendGrid } = require('../services/sender-emails.js');
const UploadAvatarService = require('../services/upload-avatar.js');

const signup = async (req, res) => {
  const {
    body: { email: emailReq },
  } = req;
  const user = await getUserByEmail(emailReq);
  if (user) {
    throw new Conflict(message.CONFLICT);
  }
  const verifyToken = uuid();
  const { email, subscription, avatarURL } = await addUser({
    ...req.body,
    verifyToken,
  });
  const verifyEmail = new SenderVerifyEmailToUser(
    NODE_ENV,
    createSenderSendGrid,
  );

  await verifyEmail.sendVerifyEmail(email, verifyToken);

  return res.status(httpCode.CREATED).json({
    status: statusCode.SUCCESS,
    code: httpCode.CREATED,
    data: {
      user: {
        email,
        subscription,
        avatarURL,
        verifyToken,
      },
    },
  });
};

const login = async (req, res) => {
  const {
    body: { email: emailReq, password },
  } = req;
  if (req.body) {
    const user = await getUserByEmail(emailReq);
    const validPass = await user?.isValidPassword(password);
    if (!user || !validPass || !user.verify) {
      throw new Unauthorized(message.NOT_AUTHORIZED);
    }
    const { id, email, subscription } = user;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' });
    await updateUserToken(id, token);
    return res.json({
      status: statusCode.SUCCESS,
      code: httpCode.OK,
      data: {
        token,
        user: {
          email,
          subscription,
        },
      },
    });
  }
};

const logout = async (req, res) => {
  const { id } = req.user;
  await updateUserToken(id, null);
  return res.status(httpCode.NO_CONTENT).json({});
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: {
      user: {
        email,
        subscription,
      },
    },
  });
};

const subscription = async (req, res) => {
  const {
    user: { id: userId },
    body,
  } = req;

  const user = await updateSubscription(userId, body);
  const { id, email, subscription } = user;
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: {
      user: { id, email, subscription },
    },
  });
};

const avatar = async (req, res) => {
  const {
    user: { id: userId },
  } = req;
  const upload = new UploadAvatarService(USERS_AVATARS);
  const addedAvatarURL = await upload.saveAvatar({ file: req.file });

  const { avatarURL } = await updateUserAvatar(userId, {
    avatarURL: addedAvatarURL,
  });
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: {
      user: { avatarURL },
    },
  });
};

const verification = async (req, res) => {
  const {
    params: { verificationToken },
    body: { email: emailReq },
  } = req;

  const user = await getUserByVerifyToken(verificationToken);
  if (!user) {
    throw new NotFound(message.NOT_FOUND);
  }

  if (emailReq && !user.verify) {
    const verifyEmail = new SenderVerifyEmailToUser(
      NODE_ENV,
      createSenderSendGrid,
    );

    await verifyEmail.sendVerifyEmail(emailReq, user.verifyToken);

    return res.json({
      status: statusCode.SUCCESS,
      code: httpCode.OK,
      message: message.VERIFY_RESEND,
    });
  }

  if (!emailReq && verificationToken === user.verifyToken) {
    await updateUserVerification(user._id, {
      verifyToken: null,
      verify: true,
    });
    return res.json({
      status: statusCode.SUCCESS,
      code: httpCode.OK,
      message: message.VERIFY_SUCCESS,
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  subscription,
  avatar,
  verification,
};
