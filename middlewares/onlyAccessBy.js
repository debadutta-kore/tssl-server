module.exports =  (...roles)=>{
    return (req,res,next)=>{
        if(roles.includes(req.sessionData.role)) {
            next();
        } else {
            res.status(403).send({message: "Access Denied: Sorry, you do not have permission to view this page"});
        }
    }
}