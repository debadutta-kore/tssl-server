const { body } = require("express-validator");

module.exports = (schema) => {
    return [
        body().custom((value, { req }) => {
          const errors = schema.validateSync(req.body, { abortEarly: false });
          if (errors) {
            throw errors.inner;
          }
          return true;
        }),
    ]
}