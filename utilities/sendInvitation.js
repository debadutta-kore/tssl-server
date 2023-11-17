const ejs = require("ejs");
const { readFileSync } = require("fs");
const path = require("path");
const mail = require("@sendgrid/mail");
module.exports = async (to, { name, password,assetBaseUrl,baseurl }) => {
  try {
   const htmlStr = await ejs
    .renderFile(path.join(__dirname, "../templates/invite.ejs"), {
      name,
      email: to,
      password: password,
      companyLogo: assetBaseUrl+ "/company-logo.png",
      productLogo: assetBaseUrl + "/product-logo.png",
      baseurl
    });
    await mail.send({
      from: "travelassistdev@kore.com",
      to,
      subject: "Welcome to TSSL!",
      html: htmlStr,
    });
  } catch(err) {
    console.log(err);
  }
};
