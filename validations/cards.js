const Joi = require("joi");
module.exports = {
  createCard: {
    body: Joi.object({
      title: Joi.string().required(),
      project: Joi.string(),
      board: Joi.string().required(),
    }),
  },
};
