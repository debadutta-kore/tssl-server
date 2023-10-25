const { addRow, deleteRow, getRows, updateRow, getRowById } = require("../db");
const bcrypt = require("bcrypt");

module.exports.addUserData = (req, res, next) => {
  addRow("user", {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    name: req.body.name,
    role: req.params.role,
    enable: 1,
  })
    .then((response) => {
      if (response.data) {
        res.status(201).send({
          name: response.data.name,
          id: response.data._id,
        });
      } else {
        res.status(400).send({
          message: "Unable to add user",
        });
      }
    })
    .catch(next);
};

module.exports.updateUserData = (req, res, next) => {
  updateRow("user", {
    query: {
      expressions: [
        {
          field: "email",
          operand: "=",
          value: req.body.email,
        },
        {
          field: "role",
          operand: "=",
          value: req.body.role,
        },
      ],
      operator: "and",
    },
    data: {
      password: bcrypt.hashSync(req.body.password, 10),
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

module.exports.deleteUserData = (req, res, next) => {
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

module.exports.getAllUserData = (req, res, next) => {
  getRows("user", {
    query: {
      role: req.params.role,
    },
  })
    .then((response) => {
      if (response.data && response.data.records.length > 0) {
        res.status(200).send(
          response.data.records.map((user) => {
            return {
              name: user.name,
              id: user._id,
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
  getRowById('user',req.sessionData.userId).then((_row)=>{
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
            value: req.params.role,
          },
        ],
        operator: "and",
      },
      data: {
        enable: req.body.enable,
      },
    })
      .then((response) => {
        const status = req.body.enable ? 'Enable' : 'Disable';
        if (response.data && response.data.nModified === 1) {
          res.status(200).send({
            message: `The user account is ${status} successfully`,
          });
        } else {
          res
            .status(400)
            .send({ message: `The unable to ${status} user account` });
        }
      })
      .catch(next);
  }).catch(next);
};

module.exports.getProfileDetails = (req, res, next) => {
  getRowById("user", req.params.role === "admin"
  ? req.sessionData.adminId
  : req.sessionData.userId)
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
