const {
  updateSession,
  deleteSession,
  getUser,
  saveSession,
  getSession,
} = require("../api/db");

const bcrypt = require("bcrypt");
module.exports.login = (req, res, next) => {
  if (req.body.email && req.body.password) {
    getUser({
      query: {
        email: req.body.email,
      },
    })
      .then(async (response) => {
        if (response.data.records.length > 0) {
          if (
            bcrypt.compareSync(
              req.body.password,
              response.data.records[0].password
            )
          ) {
            await saveSession({
              sessionId: req.sessionId,
              userId: response.data.records[0]._id,
              role: response.data.records[0].role,
            })
              .then((sessionResponse) => {
                // Save the new session ID in the response
                res.cookie("sessionId", req.sessionId, {
                  signed: true,
                  httpOnly: true,
                  expires: new Date(Date.now() + 30 * 60 * 1000),
                });
                res.status(200).send({
                  role: response.data.records[0].role,
                  [response.data.records[0].role === "admin"
                    ? "adminId"
                    : "userId"]: response.data.records[0]._id,
                  message: "Login successful",
                });
              })
              .catch(next);
          } else {
            res.status(401).json({ message: "wrong password" });
          }
        } else {
          res.status(401).json({ message: "user not found" });
        }
      })
      .catch(next);
  } else {
    let errorMessage = "";
    if (!req.body.email) {
      errorMessage = "email is undefined";
    } else {
      errorMessage = "password is undefined";
    }
    next(errorMessage);
  }
};


module.exports.loginWithSession = (req, res, next) => {
  getSession({
    query: {
      sessionId: req.sessionId,
    },
  })
    .then((dbRes) => {
      const record = dbRes.data.records[0];
      res
        .status(200)
        .json({
          role: record.role,
          [record.role === "admin" ? "adminId" : "userId"]: record.userId,
        });
    })
    .catch(next);
};

module.exports.deleteUserSession = (req, res, next) => {
  deleteSession(req.body.id)
    .then(() => {
      res.cookie("sessionId", req.sessionId, {
        signed: true,
        httpOnly: true,
        expires: new Date(Date.now() - 30 * 60 * 1000),
      });
      res.status(200).send({ message: "successfully logout" });
    })
    .catch(next);
};
