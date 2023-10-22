module.exports.protectRoute = function (req,res,next) {
    if(req.signedCookies.sessionId) {
        next();
    } else {
        next({status: 400, message:"It is a protected route"})
    }
}