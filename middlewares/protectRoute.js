const { getRowById } = require("../db");

module.exports.protectRoute = function (req,res,next) {
    if(req.sessionData) {
        if(req.sessionData.role === 'user') {
            // Check if the user account is not disabled
            getRowById("user",req.sessionData.userId).then((_res) => {
              if (_res.data && _res.data.enable === 1) {
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