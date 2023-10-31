const {Form} = require('multiparty');
const fs = require('fs');
module.exports = (req,res,next)=>{
    var form = new Form();
    form.parse(req, function(err, fields, attachments) {
        try {
            req.body = {};
            Object.entries(fields).forEach((([key,value])=>{req.body[key]=value[0]}));
            const files = [];
            for(const [file] of Object.values(attachments)){
                files.push({
                    content: fs.readFileSync(file.path).toString('base64'),
                    type: file.headers['content-type'],
                    size: file.size,
                    name: file.originalFilename
                });
            }
            req.files = files;
            next();
        } catch(err){
            next(err);
        }
    });
}