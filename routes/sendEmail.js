const mail = require("@sendgrid/mail");
const { getRowById } = require("../db");
module.exports = (req, res, next) => {
  getRowById('user',
    req.sessionData.role === "user"
      ? req.sessionData.userId
      : req.sessionData.adminId
  ).then(async (_res) => {
    if (_res && _res.data) {
      const mailRes = await mail
        .send({
          from: "travelassistdev@kore.com",
          to: [req.body.to, "foodassistdev@kore.com"],
          subject: `${req.body.queryType} - ${req.body.subject}`,
          templateId: "d-4243832dddf74a86a8617c21a1928c3e",
          dynamicTemplateData: {
            from: _res.data.email,
            name: _res.data.name,
            body: req.body.description
          },
          trackingSettings: {
            subscriptionTracking: {
              enable: true,
              substitutionTag: "{{{unsubscribe}}}"
            }
          },
          attachments: req.files.map((file) => ({
            content: file.content,
            filename: file.name,
            type: file.type,
            disposition: "attachment",
          })),
        })
      if (mailRes[0].statusCode < 300 && mailRes[0].statusCode >= 200) {
        res.status(200).json({ message: 'Email sent successfully' });
      } else {
        res.status(400).json({ message: 'Failed to send email' })
      }
    } else {
      res.status(500).json({ message: 'Internal Server' })
    }
  }).catch(next);
};
