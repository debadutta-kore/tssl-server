const {
  addUsecase,
  deleteUsecase,
  updateUsecase,
  getUsecase,
} = require("../api/db");

module.exports.addUsecaseData = (req, res, next) => {
  getUsecase({ query: { usecaseId: req.body.usecaseId,userId: req.body.userId } })
    .then((response) => {
      if(response.data.records.length === 0 ){
        addUsecase({
          userId: req.body.userId,
          usecaseId: req.body.usecaseId,
          enable: 1,
        })
          .then((_res) => {
            res.status(200).json({
              usecaseId: req.body.usecaseId,
              enable: 1,
              id: _res.data._id,
            });
          })
          .catch(next);
      } else {
        res.status(404).send({message:'this usecase is already there'});
      }
    })
  .catch(next);
};

module.exports.deleteUsecaseData = (req, res, next) => {
  deleteUsecase(req.body.id)
    .then((response) => {
      res.status(200).json({ isDeleted: true });
    })
    .catch(next);
};

module.exports.updateUsecaseData = (req, res, next) => {
  updateUsecase({
    query: {
      expressions: [
        {
          field: "usecaseId",
          operand: "=",
          value: req.body.usecaseId,
        },
        {
          field: "userId",
          operand: "=",
          value: req.body.userId,
        },
      ],
      operator: "and",
      data: {
        enable: req.body.enable,
      },
    },
  })
    .then((response) => {
      res
        .status(200)
        .json({ usecaseId: req.body.usecaseId, enable: req.body.enable });
    })
    .catch(next);
};

module.exports.getAllUsecaseData = (req, res, next) => {
  getUsecase({ query: { userId: req.body.userId } })
    .then((response) => {
      res.status(200).json(
        response.data.records.map(({ usecaseId, _id, enable }) => ({
          id: _id,
          usecaseId,
          enable,
        }))
      );
    })
    .catch(next);
};
