const mail = require("@sendgrid/mail");
const { getRowById } = require("../db");
const ejs = require('ejs');
const path = require("path");
module.exports = (req, res, next) => {
  getRowById('user',
    req.sessionData.role === "user"
      ? req.sessionData.userId
      : req.sessionData.adminId
  ).then(async (_res)=>{
    if(_res && _res.data) {
      const htmlStr = await ejs.renderFile(path.join(__dirname,'../templates/helpSupport.ejs'),{
        from: _res.data.email,
        name: _res.data.name,
        body: req.body.description
      });
      mail
      .send({
        from: "travelassistdev@kore.com",
        to: [req.body.to, "foodassistdev@kore.com"],
        subject: `${req.body.queryType} - ${req.body.subject}`,
        html: htmlStr,
        attachments: req.files.map((file) => ({
          content: file.content,
          filename: file.name,
          type: file.type,
          disposition: "attachment",
        })),
      })
      .then(() => {
        res.status(200).send({ message: "email send successfully" });
      })
    }
  }).catch(next);
};
