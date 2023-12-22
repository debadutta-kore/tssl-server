const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("@sendgrid/mail").setApiKey(process.env.sendGridAPIKey);
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const apiRouter = require("../routes");
const sessionMiddleware = require("../middlewares/sessionMiddleWare");
const cors = require("../middlewares/cors");
const erroHandler = require("../middlewares/erroHandler");
const globalSessionTimeout = require('../utilities/globalSessionTimeout');

app.enable("trust proxy");
globalSessionTimeout.init();

//global middlewares
app.use(cors);
app.use(express.json());
app.use(cookieParser(process.env.cookieSignedKey));
app.use(sessionMiddleware);
app.use(
  process.env.rootPath + "asset/email",
  express.static(path.join(__dirname, "../templates/img"))
);
app.use(
  process.env.rootPath,
  express.static(path.join(__dirname, "../client"))
);
app.use(process.env.rootPath + "api", apiRouter);
app.use(erroHandler);

app.get(process.env.rootPath + "*", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

module.exports.app = app;
