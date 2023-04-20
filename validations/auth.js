const Joi = require("joi");

module.exports = {
  // POST /socialappApp/auth/register
  register: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().required().min(2).max(128),
    }),
  },

  // POST /v1/auth/login
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().max(128),
    }),
  },

  forgotPassword: {
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  },

  resetPassword: {
    body: Joi.object({
      email: Joi.string().email().required(),
      hash: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
};
