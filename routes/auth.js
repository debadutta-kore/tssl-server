const { getRows, deleteRow, addRow, updateRow } = require("../db");

const bcrypt = require("bcrypt");

module.exports.login = (req, res, next) => {
  if (req.body.email && req.body.password) {
    getRows("user", {
      query: {
        email: req.body.email,
      },
    })
      .then(async (response) => {
        if (response.data && response.data?.records?.length === 1 && response.data.records[0].enable === 1) {
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
              role: response.data.records[0].role,
            })
              .then(() => {
                // Save the new session ID in the response
                const cookieSettings = {
                  signed: true,
                  httpOnly: true,
                  domain: new URL(req.get("origin")).host,
                  expires: new Date(Date.now() + 30 * 60 * 1000)
                }
                // if(req.protocol === 'https') {
                //   cookieSettings['secure'] = true;
                //   cookieSettings['sameSite'] = 'None';
                // } 
                res.cookie("sessionId", req.sessionId, cookieSettings);
                res.status(200).send({
                  message: "Successfully logged in",
                  role: response.data.records[0].role,
                });
              })
              .catch(next);
          } else {
            res.status(400).send({ password: "Wrong password" });
          }
        } else {
          if(response.data && response.data?.records?.length === 1 && response.data.records[0].enable === 0){
            res.send(400).send({email:'Account is disabled'});
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
  getRows("userSession", {
    query: {
      sessionId: req.sessionId,
    },
  })
    .then((dbRes) => {
      if (dbRes.data && dbRes.data.records.length > 0) {
        const record = dbRes.data.records[0];
        let data = {
            role: record.role,
            message: "Successfully Logedin",
        };
        if(record.role === 'admin') {
          data.isChoosedUser = !!record.userId;
        }
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
        const cookieSettings = {
          signed: true,
          httpOnly: true,
          domain: new URL(req.get("origin")).host,
          expires: new Date(Date.now() - 30 * 60 * 1000)
        }
        // if(req.protocol === 'https') {
        //   cookieSettings['secure'] = true;
        //   cookieSettings['sameSite'] = 'None';
        // } 
        res.cookie("sessionId", req.sessionId, cookieSettings);
        res.status(204).send();
      } else {
        res.status(404).send({ message: "Unable to logout" });
      }
    })
    .catch(next);
};

module.exports.updateUserSession = async (req, res, next) => {
  updateRow("userSession", {
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
    },
  }).then((updateRes)=>{
    if(updateRes.data && updateRes.data.nModified === 1) {
      res.status(200).send({
        message: "successfully update the session"
      });
    } else {
      res.status(404).send({ message: "session not found" });
    }
  }).catch(next);
};
