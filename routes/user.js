const {
  addRow,
  deleteRow,
  getRows,
  updateRow,
} = require("../db");
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
  updateRow('user', {
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
    }
  })
    .then((response) => {
      if (response.data && response.data.nModified === 1) {
        res.status(200).send({
          message: 'Password is updated successfully'
        });
      } else {
        res.status(400).send({ message: 'Invalid email' });
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
  getRows('user', {
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
        res.status(404).send({ message: 'Unable to fetch user' });
      }
    })
    .catch(next);
};

module.exports.activeDeactiveUser = (req, res, next) => {
    updateRow('user', {
      query: {
        expressions: [
          {
            field: "_id",
            operand: "=",
            value: req.sessionData.userId,
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
        enable: req.body.enable
      }
    })
      .then((response) => {
        if (response.data && response.data.nModified === 1) {
          res.status(200).send({
            message: `The user account is ${req.params.status} successfully`
          });
        } else {
          res.status(400).send({ message: `The unable to ${req.params.status} user account` });
        }
      })
      .catch(next);
};