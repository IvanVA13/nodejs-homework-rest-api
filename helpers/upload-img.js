const multer = require('multer');

require('dotenv').config();
const UPLOAD = process.env.UPLOAD;

const { httpCode } = require('./constants.js');

const uniquePartOfName = `${Date.now()}~${new Date(
  Date.now(),
).toLocaleDateString('ua-UA')}`;

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, UPLOAD);
  },
  filename: (req, file, cb) => {
    const {
      user: { id: userId },
    } = req;
    cb(null, `${userId}~${uniquePartOfName}~${file.originalname}`);
  },
  limits: {
    fileSize: 2 * 1048 * 1048,
  },
});

const uploadImg = multer({
  storage: storage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true);
      return;
    }
    const err = new Error('Wrong format!');
    err.status = httpCode.BAD_REQUEST;
    cb(err);
  },
});

module.exports = uploadImg;
