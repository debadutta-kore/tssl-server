const { getRows, deleteRow, addRow, updateRow } = require("../db");

const bcrypt = require("bcrypt");

module.exports.login = (req, res, next) => {
  if (req.body.email && req.body.password) {
    getRows("user", {
      query: {
        email: req.body.email,
        enable: 1,
      },
    })
      .then(async (response) => {
        if (response.data && response.data.records.length > 0) {
          if (
            bcrypt.compareSync(
              req.body.password,
              response.data.records[0].password
            )
          ) {
            addRow("userSession", {
              sessionId: req.sessionId,
              [response.data.records[0].role === "admin"
                ? "adminId"
                : "userId"]: response.data.records[0]._id,
              [response.data.records[0].role === "admin"
                ? "userId"
                : "adminId"]: "",
              name:
                response.data.records[0].role === "user"
                  ? response.data.records[0].name
                  : "",
              role: response.data.records[0].role,
            })
              .then(() => {
                // Save the new session ID in the response
                res.cookie("sessionId", req.sessionId, {
                  signed: true,
                  httpOnly: true,
                  secure: true,
                  sameSite: "None",
                  expires: new Date(Date.now() + 30 * 60 * 1000),
                });
                res.status(200).send({
                  message: "Successfully logged in",
                  role: response.data.records[0].role,
                });
              })
              .catch(next);
          } else {
            res.status(401).send({ message: "Wrong password" });
          }
        } else {
          res.status(404).send({ message: "User not found" });
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
  getRows("userSession", {
    query: {
      sessionId: req.sessionId,
    },
  })
    .then((dbRes) => {
      if (dbRes.data && dbRes.data.records.length > 0) {
        const record = dbRes.data.records[0];
        let data = {
          data: {
            role: record.role,
            name: record.name,
          },
          message: "Successfully Logedin",
        };
        res.status(200).json(data);
      } else {
        res.status(401).send({
          message:
            "Your session ID is not valid or your account has been disabled by the admin",
        });
      }
    })
    .catch(next);
};

module.exports.deleteUserSession = (req, res, next) => {
  deleteRow("userSession", req.sessionData._id)
    .then((dbRes) => {
      if (dbRes.data && dbRes.data.nDeleted) {
        res.cookie("sessionId", req.sessionId, {
          signed: true,
          httpOnly: true,
          secure: true,
          sameSite: "None",
          expires: new Date(Date.now() - 30 * 60 * 1000),
        });
        res.status(204).send();
      } else {
        res.status(404).send({ message: "Unable to logout" });
      }
    })
    .catch(next);
};

module.exports.updateUserSession = async (req, res, next) => {
  try {
    const user = await getRows('user', {_id: req.body.userId })
    if(user.data && user.data.records.length > 0) {
      const updateRes = await updateRow("userSession", {
        query: {
          expressions: [
            {
              field: "sessionId",
              operand: "=",
              value: req.sessionId,
            },
          ],
          operator: "and",
        },
        data: {
          userId: req.body.userId,
          name: user.data.records[0].name,
        },
      });
      if(updateRes.data && updateRes.data.nModified === 1) {
        res.status(200).send({
          message: "successfully update the session",
          data: {
            name: user.data.records[0].name,
          },
        });
      } else {
        res.status(404).send({ message: "session not found" });
      }
    } else {
      res.status(400).send();
    }
  } catch(err) {
    next(err);
  }
};
