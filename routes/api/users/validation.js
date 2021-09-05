const Joi = require('joi');

const { httpCode } = require('../../../helpers/constants.js');

const userValidateSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'org'] },
    })
    .required(),
  password: Joi.string().min(8).max(48).required(),
  subscription: Joi.string().valid('starter', 'pro', 'business').optional(),
  token: Joi.string().optional(),
});

const userUpdateSubscriptionValidateSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

const validate = async (schema, validatedValue, errMessage, next) => {
  try {
    await schema.validateAsync(validatedValue);
    next();
  } catch (err) {
    next({
      status: httpCode.BAD_REQUEST,
      message: errMessage,
    });
  }
};

module.exports = {
  validationUser: (req, _, next) => {
    return validate(
      userValidateSchema,
      req.body,
      'missing required name field',
      next,
    );
  },
  validationUpdateSubscriptionUser: (req, _, next) => {
    return validate(
      userUpdateSubscriptionValidateSchema,
      req.body,
      'missing subscription field',
      next,
    );
  },
};
