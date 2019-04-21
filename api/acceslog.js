const express = require('express');
const accesslogRouter = express.Router();

accesslogRouter.post('/', (req, res, next) => {
  res.status(201).send({log: 'Nuevo log de acceso'});
});

module.exports = accesslogRouter;
