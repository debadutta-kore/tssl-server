const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const apiRouter = require("../routes");
const sessionMiddleware = require("../middlewares/sessionMiddleWare");
const cors = require("../middlewares/cors");
const erroHandler = require("../middlewares/erroHandler");

//middlewares
app.use(erroHandler);
app.use(cors);
app.use(express.json());
app.use(cookieParser("2@]>+k70fX8S:74Ou0Dz7:XPvk"));
app.use(sessionMiddleware);
app.use("/api", apiRouter);

app.get('/',(req,res)=>{
    res.send('<h1> Kore.ai </h1>');
});

module.exports.app = app;