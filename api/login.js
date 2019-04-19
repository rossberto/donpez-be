const express = require('express');
const loginRouter = express.Router();

var rtg = require('random-token-generator');

const admin = {
  username: 'ross',
  password: 'contrasena',
  type: 'admin'
}

const cashier = {
  username: 'cajero',
  password: 'test',
  type: 'cashier'
}

const users = [admin, cashier];
let token = '';

function checkUserData(req, res, next) {
  const userdata = req.headers.authorization.split('&');
  const user = userdata[0];
  const pwd = userdata[1];

  users.map(employee => {
    if (employee.username === user &&
        employee.password === pwd) {
      res.userType = employee.type;
      next();
    } else {
      return;
    }
  });

  res.status(404).send();
}

loginRouter.post('/', checkUserData, (req, res, next) => {
  rtg.generateKey({
      len: 16, // Generate 16 characters or bytes of data
      string: true, // Output keys as a hex string
      strong: false, // Use the crypographically secure randomBytes function
      retry: false // Retry once on error
  }, function(err, key) {
      token = key;
      const userType = res.userType;
      console.log(token);
      console.log(res.userType);
      res.status(201).send({
        token: token,
        userType: userType
      });
  });
});

module.exports = loginRouter;
