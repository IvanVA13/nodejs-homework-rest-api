const { Schema, model } = require('mongoose');
const gravatar = require('gravatar');

const bcrypt = require('bcryptjs');

const user = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(
          this.email,
          {
            s: '250',
          },
          true,
        );
      },
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { versionKey: false, timestamps: true },
);

const passCrypt = async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(9);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
};

const isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

user.pre('save', passCrypt);
user.methods.isValidPassword = isValidPassword;
const User = model('user', user);
module.exports = User;
