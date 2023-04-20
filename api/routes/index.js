const router = require("express").Router();
const authRoutes = require("./auth.route");
const boardRoutes = require("./boards.route");
const cardRoutes = require("./card.routes");

router.use("/auth", authRoutes);
router.use("/board", boardRoutes);
router.use("/card", cardRoutes);

module.exports = router;
