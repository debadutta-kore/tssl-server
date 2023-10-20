const uuid = require("uuid").v4;

const sessionMiddleware = (req, res, next) => {
  if (!req?.signedCookies?.sessionId) {
    // Generate a new session ID if it doesn't exist
    const sessionId = uuid();
    req.sessionId = sessionId;
  } else {
    // Extract the session ID from the cookie
    req.sessionId = req.signedCookies.sessionId
    res.cookie('sessionId', req.sessionId, {
      signed: true,
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 60 * 1000)
    });
  }
  next();
};

module.exports = sessionMiddleware;
