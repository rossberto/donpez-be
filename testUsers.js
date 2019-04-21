const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

const insertSql = 'INSERT INTO User ' +
            '(username, password, user_type) VALUES ' +
            '($username, $password, $usertype)';
let values;

db.serialize(() => {
  values = {
    $username: 'admin',
    $password: 'adminpass',
    $usertype: 'Administrador'
  }
  db.run(insertSql, values, function(err) {
    if (err) throw err;

    const getSql = `SELECT * FROM User WHERE id=${this.lastID}`;
    db.get(getSql, (err, user) => {
      console.log(user);
    });
  });

  values = {
    $username: 'cajero',
    $password: 'cajeropass',
    $usertype: 'Cajero'
  }
  db.run(insertSql, values, function(err) {
    if (err) throw err;

    const getSql = `SELECT * FROM User WHERE id=${this.lastID}`;
    db.get(getSql, (err, user) => {
      console.log(user);
    });
  });
});
