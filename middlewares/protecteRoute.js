module.exports.protectRoute = function (req,res,next) {
    if(req.signedCookies.sessionId) {
        next();
    } else {
        next("This is a protected route you can't access it without browser's session id")
    }
}