const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const apiRouter = require("../routes");
const sessionMiddleware = require("../middlewares/sessionMiddleWare");
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser("2@]>+k70fX8S:74Ou0Dz7:XPvk"));
app.use(sessionMiddleware);
app.use("/", apiRouter);
app.use("/api", apiRouter);
app.use("/", (req, res) => {
    res.send("<h1>kore.ai</h1>");
});

module.exports = app;
