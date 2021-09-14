const jwt = require('jsonwebtoken');

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const USERS_AVATARS = process.env.USERS_AVATARS;

const { httpCode, message, statusCode } = require('../helpers/constants.js');
const {
  getUserByEmail,
  addUser,
  updateUserToken,
  updateSubscription,
  updateUserAvatar,
} = require('../repositories/users.js');
const UploadAvatarService = require('../services/upload-avatar.js');

const signup = async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.body.email);
    if (user) {
      return res.status(httpCode.CONFLICT).json({
        status: statusCode.CONFLICT,
        code: httpCode.ERROR,
        message: message.CONFLICT,
      });
    }
    const { email, subscription, avatarURL } = await addUser(req.body);
    return res.status(httpCode.CREATED).json({
      status: statusCode.SUCCESS,
      code: httpCode.CREATED,
      data: {
        user: {
          email,
          subscription,
          avatarURL,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    if (req.body) {
      const user = await getUserByEmail(req.body.email);
      const validPass = await user?.isValidPassword(req.body.password);
      if (!user || !validPass) {
        return res.status(httpCode.UNAUTHORIZED).json({
          status: statusCode.UNAUTHORIZED,
          code: httpCode.UNAUTHORIZED,
          message: message.BAD_EMAIL_OR_PASSWORD,
        });
      }
      const { id, email, subscription } = user;
      const payload = { id, email, subscription };
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
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await updateUserToken(id, null);
    return res.status(httpCode.NO_CONTENT).json({});
  } catch (err) {
    next(err);
  }
};

const current = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

const subscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await updateSubscription(userId, req.body);
    const { id, email, subscription } = user;
    return res.json({
      status: statusCode.SUCCESS,
      code: httpCode.OK,
      data: {
        user: { id, email, subscription },
      },
    });
  } catch (err) {
    next(err);
  }
};

const avatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
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
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, logout, current, subscription, avatar };
