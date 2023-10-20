const { addUser, updateUser, deleteUser, getUser } = require("../db");
const bcrypt = require('bcrypt');
module.exports.addUserData = (req, res, next) => {
  addUser({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    name: req.body.name,
    role: req.body.role
  })
    .then((response) => {
      res.status(200).json({
        name: response.data.name,
        id: response.data._id
      })
    })
    .catch(next);
};

module.exports.updateUserData = (req, res, next) => {
  updateUser({
    query: {
      expressions: [
        {
          field: "email",
          operand: "=",
          value: req.body.email,
        },
        {
          field: "password",
          operand: "=",
          value: req.body.currentPassword,
        },
      ],
      operator:'and',
      data: {
        password: req.body.resetPassword,
      },
    },
  })
    .then((response) => {
      res.status(200).send();
    })
    .catch(next);
};

module.exports.deleteUserData = (req, res, next) => {
  deleteUser(req.body.id)
    .then((response) => {
        res.status(200).send({isDeleted: true});
    })
    .catch(next);
};

module.exports.getAllUserData = (req, res, next) => {
  getUser({
    query:{
      role: req.body.role
    }
  })
    .then((response) => {
        res.status(200).json(response.data.records.map((user)=>{
          return {
            name: user.name,
            id: user._id
          }
        }));
    })
    .catch(next);
};
