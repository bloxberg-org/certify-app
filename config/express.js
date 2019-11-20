const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const swig = require("swig");
const helemet = require("helmet");
const cors = require("cors");
const errorHandler = require("errorhandler");
const history = require("connect-history-api-fallback");

module.exports = {
  attachMiddleWares: app => {
    app.set("port", process.env.EXPRESS_PORT || 5000);
    app.use(morgan("common"));
    app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
    app.use(
      bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
        type: "application/x-www-form-urlencoded"
      })
    );
    app.use(helemet());
    app.use(cors());
    app.use(errorHandler());
    app.use(history());
    // Import server-routes.
  }
};
