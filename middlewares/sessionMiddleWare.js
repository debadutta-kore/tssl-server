const cookieSettings = require("../utilities/cookieSettings");
const jwt = require("jsonwebtoken");
const globalSessionTimeout = require("../utilities/globalSessionTimeout");

const sessionMiddleware = (req, res, next) => {
  const sessionTimeout = globalSessionTimeout.getSessionTimeout();
  if (req?.signedCookies?.session) {
    // Extract the session from the cookie
    jwt.verify(
      req.signedCookies.session,
      process.env.jwtSecret,
      (err, data) => {
        if (err) {
          next(err);
        } else {
          req.sessionData = data;
          res.cookie(
            "session",
            jwt.sign(req.sessionData, process.env.jwtSecret),
            {
              ...cookieSettings,
              expires: new Date(Date.now() + sessionTimeout),
            }
          );
          next();
        }
      }
    );
  } else {
    next();
  }
};

module.exports = sessionMiddleware;
