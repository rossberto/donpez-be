const express = require('express');
const apiRouter = express.Router();

const purchaseRouter = require('./purchase');

apiRouter.use('/purchase', purchaseRouter);

apiRouter.get('/', (req, res, next) => {
  console.log('>>> Get API succesful');

  res.status(200).send({mirespues: "Chido liro"});
});


module.exports = apiRouter;
