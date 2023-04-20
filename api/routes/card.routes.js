const router = require("express").Router();
const { validate } = require("express-validation");
const { CardsValidations } = require("../../validations");
const { Card } = require("../models");
const { isAuthenticated } = require("../../middlewares/auth");

const createCard = async (req, res, next) => {
  let card = new Card({
    title: req.body.title,
    project: req.body.project,
    board: req.body.board,
    createdBy: req.user.ID,
  });

  card
    .save()
    .then((doc) => {
      return res.status(201).json(doc);
    })
    .catch((err) => next(err));
};

const getAllByBoard = (req, res, next) => {
  Card.find({ board: req.params.ID, createdBy: req.user.ID })
    .populate([
      { path: "board", select: { title: 1, _id: 1 } },
      { path: "createdBy", select: { name: 1, email: 1, _id: 1 } },
    ])
    .then((docs) => {
      res.json({ data: docs });
    })
    .catch((err) => next(err));
};

const getAll = (req, res, next) => {
  Card.find({ createdBy: req.user.ID })
    .populate([
      { path: "board", select: { title: 1, _id: 1 } },
      { path: "createdBy", select: { name: 1, email: 1, _id: 1 } },
    ])
    .then((docs) => {
      res.json({ data: docs });
    })
    .catch((err) => next(err));
};

/**
 * @api {post} /api/board CreateCard
 * @apiDescription Create a Card
 * @apiVersion 1.0.0
 * @apiName CreateCard
 * @apiGroup Cards
 * @apiPermission private
 *
 * @apiHeader {String} Athorization  Users's jwt Bearer token
 *
 * @apiParam  {String}          title     Card's title
 * @apiParam  {String}          title     Card's project
 *
 * @apiSuccess (Created 201) {String}  data._id           Card's id
 * @apiSuccess (Created 201) {String}  data.title         Card's title
 * @apiSuccess (Created 201) {String}  data.project         Card's project
 * @apiSuccess (Created 201) {String}  data.board         Card's board belongs to
 * @apiSuccess (Created 201) {Date}  data.createdAt       Card's created timestamps
 * @apiSuccess (Created 201) {Date}  data.updatedAt       Card's update timestamps
 *
 * @apiError (Unauthorized 401) Unauthorized Error  User is not authorized
 * @apiError (Bad Request 400)  ValidationError     Some parameters may contain invalid values
 */
router
  .route("/")
  .post(
    validate(CardsValidations.createCard, {}, {}),
    isAuthenticated,
    createCard,
  );

/**
 * @api {get} taskmanagement/api/card GetAllCards
 * @apiDescription Get all cards of a user
 * @apiVersion 1.0.0
 * @apiName GetAllCards
 * @apiGroup Cards
 * @apiPermission private
 *
 * @apiHeader {String} Athorization  Users's jwt Bearer token
 *
 *
 * @apiSuccess {Object[]} data Array of user's cards.
 *
 * @apiError (Unauthorized 401) Unauthorized Error  User is not authorized
 * @apiError (Bad Request 400)  ValidationError     Some parameters may contain invalid values
 */
router.route("/").get(isAuthenticated, getAll);

/**
 * @api {get} taskmanagement/api/card/:ID GetAllCardsByBoard
 * @apiDescription Get all cards against board of user's
 * @apiVersion 1.0.0
 * @apiName GetAllCardsByBoard
 * @apiGroup Cards
 * @apiPermission private
 *
 * @apiHeader {String} Athorization  Users's jwt Bearer token
 *
 * @apiParam {String} ID board's id
 *
 * @apiSuccess {Object[]} data Array of cards belonging to board.
 *
 * @apiError (Unauthorized 401) Unauthorized Error  User is not authorized
 * @apiError (Bad Request 400)  ValidationError     Some parameters may contain invalid values
 */
router.route("/:ID").get(isAuthenticated, getAllByBoard);

module.exports = router;
