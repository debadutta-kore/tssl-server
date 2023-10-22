module.exports = function(err,_,res,next){
    if(err) {
        if(typeof err === 'object') {
            res.status(err.status || 500).send(err.message);
        } else {
            res.status(500).send(err);
        }
    } else {
        next();
    }
}