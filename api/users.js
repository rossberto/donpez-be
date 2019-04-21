const express = require('express');
const usersRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

function getUserValues(req, res, next) {
  const newUser = req.body.user;

  if (newUser && newUser.username && newUser.password && newUser.userType) {
    req.userValues = {
      $username: newUser.username,
      $password: newUser.password,
      $usertype: newUser.userType
    }

    next();
  } else {
    res.status(400).send();
  }
}

usersRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM User';
  db.all(sql, (err, users) => {
    if (err) throw err;

    res.status(200).send({users: users});
  });
});

usersRouter.post('/', getUserValues, (req, res, next) => {
  const sql = 'INSERT INTO User ' +
              '(username, password, user_type) VALUES ' +
              '($username, $password, $usertype)';
  db.run(sql, req.userValues, function(err) {
    if (err) throw err;

    db.get(`SELECT * FROM User WHERE id=${this.lastID}`, (err, user) => {
      if (err) throw err;

      res.status(201).send(user);
    });
  });
});

module.exports = usersRouter;
