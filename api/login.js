const express = require('express');
const loginRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

const aux = require('./aux.js');

var rtg = require('random-token-generator');

function checkUserData(req, res, next) {
  const userdata = req.headers.authorization.split('&');
  const username = userdata[0];
  const pwd = userdata[1];

  const sql = `SELECT * FROM User WHERE username="${username}"`;
  db.get(sql, (err, user) => {
    if (err) {next(err)}

    if (user) {
      if (user.password === pwd) {
        req.user = user;
        next();
      } else {
        res.status(401).send();
      }
    } else {
      res.status(404).send();
    }
  });
}

function generateToken(req, res, next) {
  rtg.generateKey({
      len: 16, // Generate 16 characters or bytes of data
      string: true, // Output keys as a hex string
      strong: false, // Use the crypographically secure randomBytes function
      retry: false // Retry once on error
  }, (err, key) => {
      req.token = key;
      next();
  });
}

function registerLogin(req, res, next) {
  let sql = 'INSERT INTO AccessLog ' +
              '(login_date, access_type, user_id, token) VALUES ' +
              '($loginDate, $accessType, $userId, $token)';
  const date = new Date();
  const values = {
    $loginDate: JSON.stringify(date),
    $accessType: req.user.user_type,
    $userId: req.user.id,
    $token: req.token
  };
  db.run(sql, values, function(err) {
    if (err) {next(err)}

    sql = `SELECT * FROM AccessLog WHERE id=${this.lastID}`;
    db.get(sql, (err, access) => {
      if (err) {next(err)}

      res.access = access;
      next();
    });
  });
}

loginRouter.post('/', checkUserData, generateToken, registerLogin, (req, res, next) => {
  res.status(201).send(res.access);
});

loginRouter.put('/', aux.getToken, aux.validateToken, (req, res, next) => {
  date = new Date();
  let sql = 'UPDATE AccessLog ' +
              `SET logout_date = $date, active_session = 0 ` +
              'WHERE id = $id';
  values = {
    $date: JSON.stringify(date),
    $id: req.accessId
  };

  db.run(sql, values, (err) => {
    if (err) {next(err)}

    sql = 'SELECT * FROM AccessLog WHERE id=$id';
    db.get(sql, {$id: req.accessId}, (err, accessLog) => {
      if (err) {next(err)}

      console.log(accessLog);

      res.status(200).send({logout: 'completed'});
    });
  });
});

















module.exports = loginRouter;
