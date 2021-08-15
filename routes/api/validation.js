const Joi = require('joi');

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

const validate = async (schema, validatedValue, next) => {
  try {
    await schema.validateAsync(validatedValue);
    console.log(validatedValue);
    next();
  } catch (err) {
    next({
      status: 400,
      message:
        schema === schemaAddContact
          ? 'missing required name field'
          : 'missing fields',
    });
  }
};

module.exports = {
  validationAddContact: (req, res, next) => {
    return validate(schemaAddContact, req.body, next);
  },
  validationUpdateContact: (req, res, next) => {
    return validate(schemaUpdateContact, req.body, next);
  },
};
