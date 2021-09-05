const Joi = require('joi');

const { httpCode } = require('../../../helpers/constants.js');

const schemaAddContact = Joi.object({
  name: Joi.string()
    .regex(/^\w+(?:\s+\w+)*$/)
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.string().regex(/^\d+/).min(10).max(12).required(),
  favorite: Joi.boolean().optional(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string()
    .regex(/^\w+(?:\s+\w+)*$/)
    .min(3)
    .max(30)
    .optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .optional(),
  phone: Joi.string().regex(/^\d+/).min(10).max(12).optional(),
}).or('name', 'email', 'phone');

const schemaUpdateContactFavoriteStatus = Joi.object({
  favorite: Joi.boolean().required(),
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
  validationAddContact: (req, _, next) => {
    return validate(
      schemaAddContact,
      req.body,
      'missing required name field',
      next,
    );
  },
  validationUpdateContact: (req, _, next) => {
    return validate(schemaUpdateContact, req.body, 'missing fields', next);
  },
  validationUpdateContactFavoriteStatus: (req, _, next) => {
    return validate(
      schemaUpdateContactFavoriteStatus,
      req.body,
      'missing field favorite',
      next,
    );
  },
};
