const express = require('express');
const apiRouter = express.Router();

const authRouter = require('./auth');
const loginRouter = require('./login');
const accesslogRouter = require('./acceslog');
const purchaseRouter = require('./purchase');
const usersRouter = require('./users');

apiRouter.use('/login', loginRouter);
apiRouter.use('/acceslog', accesslogRouter)
apiRouter.use('/purchase', purchaseRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
