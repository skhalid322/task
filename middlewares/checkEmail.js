const httpStatus = require("http-status");
const { User } = require("../api/models");
const APIError = require("../utils/APIError");

async function checkEmail(req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const apiError = new APIError({
      message: "Email Already Taken",
      status: httpStatus.CONFLICT,
      stack: undefined,
    });
    return next(apiError);
  }

  return next();
}
module.exports = { checkEmail };
