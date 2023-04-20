const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compress = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./api/routes");
const { logs } = require("./config");
const error = require("./middlewares/error");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const { port, mongourl } = require("./config");

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs, { stream: accessLogStream }));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

mongoose
  .connect(mongourl, { keepAlive: true })
  .then(() => {
    console.log("mongodb connected for db taskmanagement");
  })
  .catch((err) => {
    console.log("------- error connecting db -------");
    console.log(err);
    console.log("------- error connecting db -------");
    process.exit(1);
  });
// USING SERVER PUBLIC DIRECTORY
var publicFolder = path.resolve(__dirname, "public");
app.use(express.static(publicFolder));
app.use(express.static(path.join(__dirname, "docs")));
//USING SERVER PUBLIC DIRECTORY

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
// mount api v1 routes
app.use("/api", routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

const PORT = port || 8080;
app.listen(PORT, () => console.info(`server started on port ${PORT}`));
