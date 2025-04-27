import Joi from 'joi';
import { emailRegexp } from '../constants/regexp.js';

export const authRegisterSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.email': 'Enter a valid email',
    'string.empty': 'Email is required',
    'any.required': 'missing required field email',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password should be at least {#limit} characters long',
    'string.empty': 'Password is required',
    'any.required': 'missing required field password',
  }),
  subscription: Joi.string().valid('starter', 'pro', 'business'),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': 'Enter a valid email',
    'string.empty': 'Email is required',
    'any.required': 'missing required field email',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'any.required': 'missing required field password',
  }),
});

export const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': 'Enter a valid email',
    'string.empty': 'Email is required',
    'any.required': 'missing required field email',
  }),
});
