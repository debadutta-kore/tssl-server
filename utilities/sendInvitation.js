const ejs = require("ejs");
const { readFileSync } = require("fs");
const path = require("path");
const mail = require("@sendgrid/mail");
module.exports = (to, { name, password, hostUrl }) => {
  ejs
    .renderFile(path.join(__dirname, "../templates/invite.ejs"), {
      name,
      email: to,
      password: password,
      companyLogo: hostUrl + "/company-logo.png",
      productLogo: hostUrl + "/product-logo.png",
    })
    .then((htmlStr) => {
      mail.send({
        from: "debadutta.panda@kore.com",
        to,
        subject: "Welcome to TSSL!",
        html: htmlStr,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
