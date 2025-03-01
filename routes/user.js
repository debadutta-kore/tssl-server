const { addRow, deleteRow, getRows, updateRow, getRowById } = require("../db");
const url = require("url");
const sendInvitation = require("../utilities/sendInvitation");

module.exports.addUser = (req, res, next) => {
  getRows("user", {
    query: {
      email: req.body.email,
    },
  })
    .then((_res) => {
      if (_res.data && _res.data.records.length === 0) {
        addRow("user", {
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
          role: "user",
          enable: 1,
        })
          .then(async (response) => {
            if (response.data) {
                await sendInvitation(req.body.email, {
                  name: req.body.name,
                  password: req.body.password,
                  url: url.format({
                    protocol: req.protocol,
                    host: req.get("host"),
                    pathname: process.env.rootPath+'/'
                  }),
                });
                res.status(201).send({
                  name: response.data.name,
                  id: response.data._id,
                  enable: 1,
                });
            }
          })
          .catch(next);
      } else {
        res.status(400).send({ email: "User already exist" });
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  updateRow("user", {
    query: {
      expressions: [
        {
          field: "email",
          operand: "=",
          value: req.body.email,
        },
      ],
      operator: "and",
    },
    data: {
      password: req.body.password,
    },
  })
    .then((response) => {
      if (response.data && response.data.nModified === 1) {
        res.status(200).send({
          message: "Password is updated successfully",
        });
      } else {
        res.status(400).send({ message: "Invalid email" });
      }
    })
    .catch(next);
};

module.exports.deleteUser = (req, res, next) => {
  deleteRow("user", req.params.id)
    .then((response) => {
      if (response.data && response.data.nDeleted === 1) {
        res.status(204).send({ message: "Successfully delete user" });
      } else {
        res.status(404).send({ message: "Unable to delete usecase" });
      }
    })
    .catch(next);
};

module.exports.getAllUser = (req, res, next) => {
  getRows("user", {
    query: {
      role: "user",
    },
  })
    .then((response) => {
      if (response.data && response.data.records) {
        res.status(200).send(
          response.data.records.map((user) => {
            return {
              name: user.name,
              id: user._id,
              enable: user.enable,
            };
          })
        );
      } else {
        res.status(404).send({ message: "Unable to fetch user" });
      }
    })
    .catch(next);
};

module.exports.activeDeactiveUser = (req, res, next) => {
  getRowById("user", req.sessionData.userId)
    .then((_row) => {
      updateRow("user", {
        query: {
          expressions: [
            {
              field: "sys_Id",
              operand: "=",
              value: _row.data.sys_Id,
            },
            {
              field: "role",
              operand: "=",
              value: 'user',
            },
          ],
          operator: "and",
        },
        data: {
          enable: req.body.enable,
        },
      })
        .then((response) => {
          const status = req.body.enable ? "enabled" : "disabled";
          if (response.data && response.data.nModified === 1) {
            res.status(200).send({
              message: `The user account is ${status} successfully`,
            });
          } else {
            res
              .status(500)
              .send({ message: 'Something went wrong' });
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getProfileDetails = (req, res, next) => {
  getRowById(
    "user",
    req.sessionData.userId
  )
    .then((dbRes) => {
      if (dbRes.data) {
        res.status(200).send({
          id: dbRes.data._id,
          name: dbRes.data.name,
          enable: dbRes.data.enable,
        });
      } else {
        res.status(400).send({ message: `${req.params.role} Not found` });
      }
    })
    .catch(next);
};
