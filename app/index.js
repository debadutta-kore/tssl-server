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

app.enable('trust proxy');

//global middlewares
app.use(cors);
app.use(express.json());
app.use(cookieParser("2@]>+k70fX8S:74Ou0Dz7:XPvk"));
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, "../templates/img")));
app.use(express.static(path.join(__dirname,'../client')))
app.use("/api", apiRouter);
app.use(erroHandler);

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname,'../client/index.html'));
});

module.exports.app = app;
