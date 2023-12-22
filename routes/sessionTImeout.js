const globalSessionTimeout = require("../utilities/globalSessionTimeout");

module.exports.modifySessionTimeout = (req,res)=>{
    const timeout = req.body.timeout
    if(typeof timeout === 'number') {
        globalSessionTimeout.setSessionTimeout(timeout);
        res.status(200).json({message:'modify timeout to '+timeout+'ms'});
    } else {
        res.status(400).json({message:'timeout should be of type '+(typeof timeout)})
    }
}

module.exports.getSessionTimeout = (req,res) => {
    const timeout = globalSessionTimeout.getSessionTimeout();
    res.status(200).json({timeout});
}