const { getRows, deleteRow, addRow, updateRow } = require("../db");
const jwt = require("jsonwebtoken");
const cookieSettings = require("../utilities/cookieSettings");
const globalSessionTimeout = require("../utilities/globalSessionTimeout");

module.exports.login = (req, res, next) => {
  const sessionTimeout = globalSessionTimeout.getSessionTimeout();
  if (req.body.email && req.body.password) {
    getRows("user", {
      query: {
        email: req.body.email,
      },
    })
      .then(async (response) => {
        if (
          response.data &&
          response.data?.records?.length === 1 &&
          response.data.records[0].enable === 1
        ) {
          if (req.body.password === response.data.records[0].password) {
            const userInfo = {
              [response.data.records[0].role === "admin"
                ? "adminId"
                : "userId"]: response.data.records[0]._id,
              [response.data.records[0].role === "admin"
                ? "userId"
                : "adminId"]: "",
              role: response.data.records[0].role,
            };
            res.cookie("session", jwt.sign(userInfo, process.env.jwtSecret), {
              ...cookieSettings,
              expires: new Date(Date.now() + sessionTimeout),
            });
            res.status(200).send({
              message: "Successfully logged in",
              role: response.data.records[0].role,
            });
          } else {
            res.status(400).send({ password: "Wrong password" });
          }
        } else {
          if (
            response.data &&
            response.data?.records?.length === 1 &&
            response.data.records[0].enable === 0
          ) {
            res.status(400).send({ email: "Account is disabled" });
          } else {
            res.status(400).send({ email: "Wrong email Id" });
          }
        }
      })
      .catch(next);
  } else {
    let errorMessage = "";
    if (!req.body.email) {
      errorMessage = "Email is missing";
    } else {
      errorMessage = "Password is missing";
    }
    res.status(400).send({ message: errorMessage });
  }
};

module.exports.loginWithSession = (req, res, next) => {
  let data = {
    role: req.sessionData.role,
    message: "Successfully Logedin",
  };
  if (req.sessionData.role === "admin") {
    data.isChoosedUser = !!req.sessionData.userId;
  }
  res.status(200).json(data);
};

module.exports.deleteUserSession = (req, res, next) => {
  const sessionTimeout = globalSessionTimeout.getSessionTimeout();
  const deleteCookieSettings = {
    ...cookieSettings,
    expires: new Date(Date.now() - sessionTimeout),
  };
  res.cookie("session", "", deleteCookieSettings);
  res.status(204).send();
};

module.exports.updateUserSession = async (req, res, next) => {
  req.sessionData.userId = req.body.userId;
  const sessionTimeout = globalSessionTimeout.getSessionTimeout();
  res.cookie("session", jwt.sign(req.sessionData, process.env.jwtSecret), {
    ...cookieSettings,
    expires: new Date(Date.now() + sessionTimeout),
  });
  res.status(200).send({
    message: "successfully update the session",
  });
};
