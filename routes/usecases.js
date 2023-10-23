const {
  getRows, addRow, updateRow, deleteRow,
} = require("../db");

module.exports.addUsecaseData = (req, res, next) => {
  getRows('userUsecase',{ query: { usecaseId: req.body.usecaseId, userId: req.sessionData.userId } })
    .then((response) => {
      if(response.data && response.data.records.length === 0 ){
        addRow('userUsecase',{
          userId: req.sessionData.userId,
          usecaseId: req.body.usecaseId,
          enable: 1,
        })
          .then((_res) => {
            res.status(200).send({
              usecaseId: req.body.usecaseId,
              enable: 1,
              id: _res.data._id,
            });
          })
          .catch(next);
      } else {
        res.status(404).send({message:'This usecase is already exist'});
      }
    })
  .catch(next);
};

module.exports.deleteUsecaseData = (req, res, next) => {
  deleteRow('userUsecase',req.params.id)
    .then((response) => {
      if(response.data && response.data.nDeleted === 1 ){
        res.status(204).send({ message:'Successfully delete the usecase' });
      } else {
        res.status(404).send({message:'Unable to delete usecase'});
      }
    })
    .catch(next);
};

module.exports.updateUsecaseData = (req, res, next) => {
  updateRow('userUsecase',{
    query: {
      expressions: [
        {
          field: "_id",
          operand: "=",
          value: req.body.id,
        }
      ],
      operator: "and",
      data: {
        enable: req.body.enable,
      },
    },
  })
    .then((response) => {
      const status = req.body.enable ? 'Enable' :'Disable';
      if(response.data && response.data.nModified === 1) {
        res
        .status(200)
        .json({ message: `Successfully ${status} usecase`});
      } else {
        res.status(404).send({message:'Unable to updated resource'});
      }
    })
    .catch(next);
};

module.exports.getAllUsecaseData = (req, res, next) => {
  getRows('userUsecase',{ query: { userId: req.sessionData.userId } })
    .then((response) => {
      res.status(200).send(
        response.data.records.map(({ usecaseId, _id, enable }) => ({
          id: _id,
          usecaseId,
          enable,
        }))
      );
    })
    .catch(next);
};
