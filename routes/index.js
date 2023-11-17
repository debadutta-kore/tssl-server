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
  addUser,
  updateUser,
  deleteUser,
  getAllUser,
  activeDeactiveUser,
  getProfileDetails,
} = require("./user");
const {
  addUsecase,
  updateUsecase,
  deleteUsecase,
  getAllUsecase,
  allAvailableUsecase,
} = require("./usecases");
const validation = require("../middlewares/validation");
const {
  buildSchema,
  emailSchema,
  passwordSchema,
} = require("../utilities/validationSchema");
const sendEmail = require("./sendEmail");
const formDataParser = require("../middlewares/formDataParser");
const onlyAccessBy = require("../middlewares/onlyAccessBy");

// routes for authentication
router.post("/auth/login", login);
router.get(
  "/auth/session",
  protectRoute,
  onlyAccessBy("admin"),
  loginWithSession
);
router.put(
  "/auth/session",
  protectRoute,
  onlyAccessBy("admin"),
  updateUserSession
);
router.delete("/auth/logout", protectRoute, deleteUserSession);

// routes for users
const accountRouteCommonMiddleWares = [protectRoute, onlyAccessBy("admin")];
router.post("/account/add", accountRouteCommonMiddleWares, addUser);
router.delete("/account/:id", accountRouteCommonMiddleWares, deleteUser);
router.get("/account/all", accountRouteCommonMiddleWares, getAllUser);
router.put(
  "/account/access",
  accountRouteCommonMiddleWares,
  activeDeactiveUser
);
router.get(
  "/account/details",
  accountRouteCommonMiddleWares,
  getProfileDetails
);
router.put(
  "/account/resetpassword",
  validation(
    buildSchema({
      email: emailSchema,
      password: passwordSchema,
    })
  ),
  updateUser
);

// routes for usecases
router.post("/usecase/add", protectRoute, onlyAccessBy("admin"), addUsecase);
router.put(
  "/usecase/update",
  protectRoute,
  onlyAccessBy("admin"),
  updateUsecase
);
router.delete(
  "/usecase/delete/:id",
  protectRoute,
  onlyAccessBy("admin"),
  deleteUsecase
);
router.get("/usecase/all", protectRoute, getAllUsecase);
router.get(
  "/usecase/available",
  protectRoute,
  onlyAccessBy("admin"),
  allAvailableUsecase
);
// email route
router.post("/email", protectRoute, formDataParser, sendEmail);

module.exports = router;
