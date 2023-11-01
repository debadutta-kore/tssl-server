const { getRows } = require("../db");

module.exports.protectRoute = function (req,res,next) {
    if(req.sessionData) {
        if(req.sessionData.role === 'user') {
            // if the user account is not disable
            getRows("user", {
              enable: 1,
              _id: req.sessionData.userId,
            }).then((_res) => {
              if (_res.data && _res.data.records.length > 0) {
                next();
              } else {
                res
                  .status(401)
                  .send({ message: "Unauthorized access to current route" });
              }
            });
        } else {
            next();
        }
    } else {
        res.status(401).send({message: "Unauthorized access to current route"});
    }
}