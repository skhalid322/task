require("dotenv").config();
module.exports = {
  mongourl: process.env.MONGO_URL,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  logs: "combined",
};
