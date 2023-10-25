const express = require("express");
const router = express.Router();
const { loginWithSession, login, deleteUserSession, updateUserSession } = require("./auth");
const { protectRoute } = require("../middlewares/protecteRoute");
const {
    addUserData,
    updateUserData,
    deleteUserData,
    getAllUserData,
    activeDeactiveUser
} = require("./user");
const {
    addUsecaseData,
    updateUsecaseData,
    deleteUsecaseData,
    getAllUsecaseData,
} = require("./usecases");
const validation = require("../middlewares/validation");
const { buildSchema, emailSchema, passwordSchema, roleSchema } = require("../utilities/validationSchema");

// routes for authentication
router.post("/auth/login", login);
router.get("/auth/session", protectRoute, loginWithSession);
router.put('/auth/session', protectRoute, updateUserSession);
router.delete("/auth/logout", protectRoute, deleteUserSession);

// routes for users
router.post("/account/:role", protectRoute, addUserData);
router.delete("/account/user/:id", protectRoute, deleteUserData);
router.get("/account/:role", protectRoute, getAllUserData);
router.put('/account/user/access', protectRoute , activeDeactiveUser);

router.put("/account/resetpassword", validation(buildSchema({
    email: emailSchema,
    password: passwordSchema,
    role: roleSchema
})) , updateUserData);

// routes for usecases
router.post("/usecase/add", protectRoute, addUsecaseData);
router.put("/usecase/update", protectRoute, updateUsecaseData);
router.delete("/usecase/delete/:id", protectRoute, deleteUsecaseData);
router.get("/usecase/all", protectRoute, getAllUsecaseData);

module.exports = router;
