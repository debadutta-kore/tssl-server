const express = require('express');
const router = express.Router();
const {loginWithSession, login, deleteUserSession} = require('./auth');
const { protectRoute } = require('../middlewares/protecteRoute');
const { addUserData, updateUserData, deleteUserData, getAllUserData } = require('./user');
const { addUsecaseData, updateUsecaseData, deleteUsecaseData, getAllUsecaseData } = require('./usecases');

// routes for authentication
router.post('/auth/login',login);
router.get('/auth/session',protectRoute, loginWithSession);
router.delete('/auth/logout', protectRoute,deleteUserSession);

// routes for users
router.post('/user/add',protectRoute , addUserData);
router.delete('/user/delete', protectRoute, deleteUserData);
router.post('/user/all', protectRoute, getAllUserData);

// routes for usecases
router.post('/usecase/add',protectRoute, addUsecaseData);
router.put('/usecase/update',protectRoute, updateUsecaseData);
router.delete('/usecase/delete',protectRoute, deleteUsecaseData);
router.post('/usecase/all', protectRoute, getAllUsecaseData);

module.exports = router;