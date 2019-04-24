const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

const authType = 'Bearer ';

function getToken(req, res, next) {
  const auth = req.headers.authorization;

  if (auth && auth.startsWith(authType)) {
    const token = auth.split(' ')[1];
    req.token = token;
    next();
  } else {
    res.status(401).send();
  }
}

function validateToken(req, res, next) {
  const sql = 'SELECT * FROM AccessLog WHERE token=$token';
  const values = {$token: req.token};

  db.get(sql, values, (err, accessLog) => {
    if (err) {next(err)}

    console.log(accessLog);

    if (accessLog && accessLog.active_session === 1) {
      req.accessId = accessLog.id;
      req.userId = accessLog.user_id;
      req.accessType = accessLog.access_type;
      next();
    } else {
      res.status(401).send();
    }
  });
}

function validateAdmin(req, res, next) {
  if (req.accessType === 'Administrador') {
    next();
  } else {
    res.status(401).send();
  }
}

module.exports = {
  getToken,
  validateToken,
  validateAdmin
};
