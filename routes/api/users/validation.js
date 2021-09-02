const Joi = require('joi');

const { httpCode } = require('../../../helpers/constants.js');

const userSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'org'] },
    })
    .required(),
  password: Joi.string().min(8).max(48).required(),
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
    return validate(userSchema, req.body, 'missing required name field', next);
  },
};
