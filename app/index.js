const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const sessionMiddleware = require("../middlewares/sessionMiddleWare");
const {loginWithSession, login, deleteUserSession} = require('../routes/auth');
const { protectRoute } = require('../middlewares/protecteRoute');
const { addUserData, updateUserData, deleteUserData, getAllUserData } = require('../routes/user');
const { addUsecaseData, updateUsecaseData, deleteUsecaseData, getAllUsecaseData } = require('../routes/usecases');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser("2@]>+k70fX8S:74Ou0Dz7:XPvk"));
app.use(sessionMiddleware);
app.get('/',(req,res)=>{
    res.send('<h1> Kore.ai </h1>');
});
// routes for authentication
app.post('/auth/login',login);
app.get('/auth/session',protectRoute, loginWithSession);
app.delete('/auth/logout', protectRoute,deleteUserSession);

// routes for users
app.post('/user/add',protectRoute , addUserData);
app.delete('/user/delete', protectRoute, deleteUserData);
app.post('/user/all', protectRoute, getAllUserData);

// routes for usecases
app.post('/usecase/add',protectRoute, addUsecaseData);
app.put('/usecase/update',protectRoute, updateUsecaseData);
app.delete('/usecase/delete',protectRoute, deleteUsecaseData);
app.post('/usecase/all', protectRoute, getAllUsecaseData);

module.exports = app;
