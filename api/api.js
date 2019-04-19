const express = require('express');
const apiRouter = express.Router();

const purchaseRouter = require('./purchase');
const authRouter = require('./auth');
const loginRouter = require('./login');

apiRouter.use('/login', loginRouter);
apiRouter.use('/purchase', purchaseRouter);

module.exports = apiRouter;
