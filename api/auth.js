const express = require('express');
const authRouter = express.Router();

authRouter.post('/', (req, res, next) => {
  const body = JSON.stringify(req.body);
  const query = JSON.stringify(req.query);
  console.log(req.route.stack);
  console.log('>>> Body \n' + body);
  console.log('>>> Query \n' + query);
  res.status(200).send(body);
});

module.exports = authRouter;
