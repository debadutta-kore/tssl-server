const { getRows, addRow, updateRow, deleteRow, getRowById } = require("../db");

module.exports.addUsecase = (req, res, next) => {
  getRows("userUsecase", {
    query: { usecaseId: req.body.usecaseId, userId: req.sessionData.userId },
  })
    .then((response) => {
      if (response.data && response.data.records.length === 0) {
        Promise.all([
          addRow("userUsecase", {
            userId: req.sessionData.userId,
            usecaseId: req.body.usecaseId,
            enable: 1,
          }),
          getRowById("usecases", req.body.usecaseId),
        ])
          .then((results) => {
            const addedRowId = results[0].data._id;
            const usecaseDetails = results[1].data;
            let usecaseConfig = null;
            try {
              usecaseConfig = JSON.parse(usecaseDetails.config);
            } catch (err) {
              // empty catch
            }
            res.status(201).send({
              usecaseId: req.body.usecaseId,
              enable: 1,
              id: addedRowId,
              name: usecaseDetails.name,
              icon: usecaseDetails.icon,
              type: usecaseDetails.type,
              isComingSoon: usecaseDetails.isComingSoon,
              config: usecaseConfig,
            });
          })
          .catch(next);
      } else {
        res.status(404).send({ message: "This usecase is already exist" });
      }
    })
    .catch(next);
};

module.exports.deleteUsecase = (req, res, next) => {
  deleteRow("userUsecase", req.params.id)
    .then((response) => {
      if (response.data && response.data.nDeleted === 1) {
        res.status(204).send({ message: "Successfully delete the usecase" });
      } else {
        res.status(404).send({ message: "Unable to delete usecase" });
      }
    })
    .catch(next);
};

module.exports.updateUsecase = (req, res, next) => {
  updateRow("userUsecase", {
    query: {
      expressions: [
        {
          field: "userId",
          operand: "=",
          value: req.sessionData.userId,
        },
        {
          field: "usecaseId",
          operand: "=",
          value: req.body.usecaseId,
        },
      ],
      operator: "and",
    },
    data: {
      enable: req.body.enable,
    },
  })
    .then((response) => {
      if (response.data && response.data.nModified === 1) {
        res.status(200).json({
          id: req.body.id,
          enable: req.body.enable,
        });
      } else {
        res.status(404).send({ message: "Unable to updated resource" });
      }
    })
    .catch(next);
};

module.exports.getAllUsecase = (req, res, next) => {
  Promise.all([
    getRows("userUsecase", { query: { userId: req.sessionData.userId } }),
    getRows("usecases", { query: {} }),
  ])
    .then((results) => {
      const usecases = [];
      if (results[0].data.records && results[0].data.records) {
        for (const userUsecase of results[0].data.records) {
          if (results[1].data.records && results[1].data.records.length > 0) {
            const usecaseDetail = results[1].data.records.find(
              (usecase) => usecase._id === userUsecase.usecaseId
            );
            let usecaseConfig = null;
            try {
              usecaseConfig = JSON.parse(usecaseDetail.config);
            } catch (err) {
              // empty catch
            }
            if (usecaseDetail) {
              usecases.push({
                id: userUsecase._id,
                usecaseId: usecaseDetail._id,
                enable: userUsecase.enable,
                name: usecaseDetail.name,
                icon: usecaseDetail.icon,
                type: usecaseDetail.type,
                isComingSoon: usecaseDetail.isComingSoon,
                config: usecaseConfig,
              });
            }
          }
        }
      }
      res.status(200).json(usecases);
    })
    .catch(next);
};

module.exports.allAvailableUsecase = (req, res, next) => {
  getRows("usecases", {
    query: {},
  })
    .then((_res) => {
      if (_res.status === 200 && Array.isArray(_res.data.records)) {
        res.status(200).json(
          _res.data.records.map((value) => ({
            name: value.name,
            isComingSoon: value.isComingSoon,
            id: value._id,
          }))
        );
      } else {
        next(new Error({ status: 500, message: "Internal Server Error" }));
      }
    })
    .catch(next);
};
