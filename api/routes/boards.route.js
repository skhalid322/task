const router = require("express").Router();
const { validate } = require("express-validation");
const { BoardValidations } = require("../../validations");
const { Board } = require("../models");
const { isAuthenticated } = require("../../middlewares/auth");

const createBoard = async (req, res, next) => {
  let board = new Board({
    title: req.body.title,
    createdBy: req.user.ID,
  });

  board
    .save()
    .then((doc) => {
      return res.status(201).json(doc);
    })
    .catch((err) => next(err));
};

const getAll = (req, res, next) => {
  Board.find({})
    .populate([{ path: "createdBy", select: { name: 1, email: 1, _id: 1 } }])
    .then((docs) => {
      res.json({ data: docs });
    })
    .catch((err) => next(err));
};

/**
 * @api {post} /api/board CreateBoard
 * @apiDescription Create a Board
 * @apiVersion 1.0.0
 * @apiName CreateBoard
 * @apiGroup Boards
 * @apiPermission private
 *
 * @apiHeader {String} Athorization  Users's jwt Bearer token
 *
 * @apiParam  {String}          title     Board's title
 *
 * @apiSuccess (Created 201) {String}  data._id           Board's id
 * @apiSuccess (Created 201) {String}  data.title         Board's name
 * @apiSuccess (Created 201) {String}  data.createdBy         Board's name
 * @apiSuccess (Created 201) {Date}  data.createdAt       Board's created timestamps
 * @apiSuccess (Created 201) {Date}  data.updatedAt       Board's update timestamps
 *
 * @apiError (Unauthorized 401) Unauthorized Error  User is not authorized
 * @apiError (Bad Request 400)  ValidationError     Some parameters may contain invalid values
 */
router
  .route("/")
  .post(
    validate(BoardValidations.createBoard, {}, {}),
    isAuthenticated,
    createBoard,
  );

/**
 * @api {get} /api/board/ GetALLBoards
 * @apiDescription Get All boards
 * @apiVersion 1.0.0
 * @apiName GetAllBoards
 * @apiGroup Boards
 * @apiPermission private
 *
 * @apiHeader {String} Athorization  Users's jwt Bearer token
 *
 *
 * @apiSuccess {Object[]} data Array of boards.
 *
 * @apiError (Unauthorized 401) Unauthorized Error  User is not authorized
 */
router.route("/").get(isAuthenticated, getAll);

module.exports = router;
