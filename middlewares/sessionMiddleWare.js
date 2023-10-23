const { getRows } = require("../db");

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
  getRows('userSession',{
    query:{
      sessionId: req.sessionId
    }
  }).then(response=>{
    if(response.data.records.length > 0) {
      req.sessionData = response.data.records[0];
    } else {
      req.sessionData = null;
    }
    next()
  }).catch(next)
};

module.exports = sessionMiddleware;
