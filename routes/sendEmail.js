const mail = require("@sendgrid/mail");
module.exports = (req, res, next) => {
  mail
    .send({
      from: "debadutta.panda@kore.com",
      to: "debadebaduttapanda.7@gmail.com",
      subject: `${req.body.queryType}-${req.body.subject}`,
      text: req.body.description,
      attachments: req.files.map((file) => ({
        content: file.content,
        filename: file.name,
        type: file.type,
        disposition: "attachment",
      })),
    })
    .then(() => {
      res.status(200).send({message:'email send successfully'});
    })
    .catch((error) => {
      if (error.response) {
        res.status(200).send(error.response.body);
      } else {
        next(error);
      }
    });
};
