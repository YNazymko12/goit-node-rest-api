import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().label('name').messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name should have at least 2 characters',
  }),
  email: Joi.string().email().required().label('email').messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be a valid email',
    'string.empty': 'Email cannot be empty',
  }),
  phone: Joi.string()
    .pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)
    .required()
    .label('phone')
    .messages({
      'any.required': 'Phone is required',
      'string.empty': 'Phone cannot be empty',
      'string.pattern.base': 'Phone must be in format (XXX) XXX-XXXX',
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(100).label('name').messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name should have at least 2 characters',
  }),
  email: Joi.string().email().label('email').messages({
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email',
  }),
  phone: Joi.string()
    .pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)
    .label('phone')
    .messages({
      'string.empty': 'Phone cannot be empty',
      'string.pattern.base': 'Phone must be in format (XXX) XXX-XXXX',
    }),
})
  .min(1)
  .messages({
    'object.min': 'Body must have at least one field',
  });
