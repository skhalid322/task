const router = require("express").Router();
const { validate } = require("express-validation");
const { AuthValidations } = require("../../validations");
const { checkEmail } = require("../../middlewares/checkEmail");
const { hashPassword, comparePassword } = require("../../utils/passwordUtils");
const { generateToken } = require("../../middlewares/auth");
const { User } = require("../models");
const APIError = require("../../utils/APIError");
const httpStatus = require("http-status");

const signup = async (req, res, next) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: await hashPassword(req.body.password),
    isEmailVerified: true,
  });

  user
    .save()
    .then((doc) => {
      let token = generateToken(doc);
      return res.status(201).json({
        user: { _id: doc._id, name: doc._name, email: doc.email },
        jwtToken: token,
      });
    })
    .catch((err) => next(err));
};

const login = async (req, res, next) => {
  try {
    const apiError = new APIError({
      message: "Unauthorized",
      status: httpStatus.UNAUTHORIZED,
      stack: undefined,
    });
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(apiError);
    }

    if (!(await comparePassword(req.body.password, user.password))) {
      return next(apiError);
    }

    let token = generateToken(user);

    return res.status(201).json({
      jwtToken: token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      hash: req.body.hash,
    });
    const apiError = new APIError({
      message: "Bad request",
      status: httpStatus.BAD_REQUEST,
      stack: undefined,
    });
    if (!user) {
      return next(apiError);
    }

    await User.findOneAndUpdate(
      { _id: user._id },
      { password: await hashPassword(req.body.password), hash: null },
    );
    // for demo purpose email is not being send, directly hash is sent in response back so password could be reset.
    return res.json({
      message: "Reset password successfully.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const forgot = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const apiError = new APIError({
      message: "Email is not registerd.",
      status: httpStatus.NOT_FOUND,
      stack: undefined,
    });
    if (!user) {
      return next(apiError);
    }

    let randomString =
      Math.random().toString("16").slice(2) + Date.now().toString("16");
    await User.findOneAndUpdate({ _id: user._id }, { hash: randomString });
    // for demo purpose email is not being send, directly hash is sent in response back so password could be reset.
    return res.json({
      message: "Reset password email sent to your email.",
      hash: randomString,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * @api {post} /api/auth/signup Signup
 * @apiDescription Register a new user
 * @apiVersion 1.0.0
 * @apiName Signup
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}          email     User's email
 * @apiParam  {String{6..128}}  password  User's password
 * @apiParam  {String{6..128}}  name  User's full name
 *
 *  @apiSuccess {Object} data Authentication data
 * @apiSuccess {Object} data.user User object
 * @apiSuccess {String} data.jwtToken JWT token
 *
 * @apiError (Conflict 409)  Conflict Error  Email already in use.
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router
  .route("/signup")
  .post(validate(AuthValidations.register, {}, {}), checkEmail, signup);

/**
 * @api {post} /api/auth/reset/password ResetPassword
 * @apiDescription Reset password api
 * @apiVersion 1.0.0
 * @apiName ResetPassword
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}          email     User's email
 * @apiParam  {String}          hash      User's hash sent in the link in email
 * @apiParam  {String}          password  User's new password
 *
 * @apiSuccess (Created 200) {String}  message   Password reset successfully.
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router
  .route("/reset/password")
  .post(validate(AuthValidations.resetPassword), resetPassword);

/**
 * @api {post} /api/auth/forgot ForgotPassword
 * @apiDescription Forgot password api
 * @apiVersion 1.0.0
 * @apiName ForgotPassword
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}          email     User's email
 *
 * @apiSuccess (Created 200) {String}  message         Passoword reset email is sent to you.
 * @apiSuccess (Created 200) {String}  hash            * for testing purpose this hash is added to use it in reset password, in production a link is created using hash and send in email,
 *
 * @apiError (Conflict 404)  Record_not_found  Email does not found.
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router
  .route("/forgot")
  .post(validate(AuthValidations.forgotPassword, {}, {}), forgot);

/**
 * @api {post} v1/auth/login Login
 * @apiDescription Get an accessToken
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}         email     User's email
 * @apiParam  {String{..128}}  password  User's password
 *
 * @apiSuccess {Object} data Authentication data
 * @apiSuccess {Object} data.user User object
 * @apiSuccess {String} data.jwtToken JWT token
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or password
 */

router.route("/login").post(validate(AuthValidations.login, {}, {}), login);

module.exports = router;
