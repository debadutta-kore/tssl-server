const express = require("express");
const router = express.Router();
const {
  loginWithSession,
  login,
  deleteUserSession,
  updateUserSession,
} = require("./auth");
const { protectRoute } = require("../middlewares/protecteRoute");
const {
  addUserData,
  updateUserData,
  deleteUserData,
  getAllUserData,
  activeDeactiveUser,
  getProfileDetails,
} = require("./user");
const {
  addUsecaseData,
  updateUsecaseData,
  deleteUsecaseData,
  getAllUsecaseData,
} = require("./usecases");
const validation = require("../middlewares/validation");
const {
  buildSchema,
  emailSchema,
  passwordSchema,
} = require("../utilities/validationSchema");
const sendEmail = require("./sendEmail");
const formDataParser = require("../middlewares/formDataParser");

// routes for authentication
router.post("/auth/login", login);
router.get("/auth/session", protectRoute, loginWithSession);
router.put("/auth/session", protectRoute, updateUserSession);
router.delete("/auth/logout", protectRoute, deleteUserSession);

// routes for users
router.post("/account/:role", protectRoute, addUserData);
router.delete("/account/user/:id", protectRoute, deleteUserData);
router.get("/account/:role", protectRoute, getAllUserData);
router.put("/account/:role/access", protectRoute, activeDeactiveUser);
router.get("/account/:role/details", protectRoute, getProfileDetails);
router.put(
  "/account/resetpassword",
  validation(
    buildSchema({
      email: emailSchema,
      password: passwordSchema,
    })
  ),
  updateUserData
);

// routes for usecases
router.post("/usecase/add", protectRoute, addUsecaseData);
router.put("/usecase/update", protectRoute, updateUsecaseData);
router.delete("/usecase/delete/:id", protectRoute, deleteUsecaseData);
router.get("/usecase/all", protectRoute, getAllUsecaseData);

// email route
router.post("/email", protectRoute, formDataParser, sendEmail);


module.exports = router;
