const Yup = require("yup");
module.exports.passwordSchema = Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

module.exports.emailSchema = Yup.string()
  .required("Email is required")
  .email("Invalid email format");

module.exports.roleSchema = Yup.string()
  .required("Role is required")
  .oneOf(["admin", "user"], "role is either admin or user");

module.exports.buildSchema = (schema) => Yup.object().shape(schema);
