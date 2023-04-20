const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../utils/APIError");
const { jwt_secret } = require("../config");

function generateToken(user) {
  const { _id, email, name, isEmailVerified } = user;
  console.log("jwt_secret ...", jwt_secret);

  return jwt.sign({ ID: _id, email, name, isEmailVerified }, jwt_secret);
}

function isAuthenticated(req, res, next) {
  let token = req.header("Authorization");

  const apiError = new APIError({
    message: "Unauthorized",
    status: httpStatus.UNAUTHORIZED,
    stack: undefined,
  });

  if (!token && req.query.access_token) {
    token = req.query.access_token;
  }

  if (!token) {
    return next(apiError);
  }

  token = token.split(" ")[1];
  console.log("---- token ---------");
  console.log(token);
  console.log("---- token ---------");

  try {
    const decoded = jwt.verify(token, jwt_secret);
    console.log("decoded", decoded);
    if (!decoded.ID) {
      return next(apiError);
    }
    req.user = decoded;

    return next();
  } catch (ex) {
    console.log(ex);
    return next(ex);
  }
}

module.exports = {
  isAuthenticated,
  generateToken,
};
