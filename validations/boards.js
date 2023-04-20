const Joi = require("joi");
module.exports = {
  // POST /socialappApp/auth/register
  createBoard: {
    body: Joi.object({
      title: Joi.string().required().min(2).max(128),
    }),
  },
};
