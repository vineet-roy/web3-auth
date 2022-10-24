const express = require('express');
const commonRouter = express.Router();
// const { validateToken } = require('../controller/authMiddleware');


const { fetchUser, createUser, authUser } = require('../controller/user');

commonRouter.get('/user', fetchUser);
commonRouter.post('/user', createUser);
commonRouter.post('/auth', authUser);

//private route
// commonRouter.get('/user/profile', validateToken, fetchUserData);

module.exports = commonRouter;