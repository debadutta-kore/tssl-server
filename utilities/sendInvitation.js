const mail = require("@sendgrid/mail");
module.exports = async (to, { name, password, url }) => {
  try {
    await mail.send({
      from: "travelassistdev@kore.com",
      to,
      subject: "Welcome to TSSL!",
      templateId: 'd-3293ddc2a46b42d4ac154c8459d92a28',
      dynamicTemplateData: {
        email: to,
        name,
        url,
        password
      },
      trackingSettings:{
        subscriptionTracking:{
          enable: true,
          substitutionTag: "{{{unsubscribe}}}"
        }
      },
    });
  } catch (err) {
    console.error(err);
  }
};
