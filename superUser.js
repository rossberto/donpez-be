const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

let sql = 'INSERT INTO User ' +
            '(username, password, user_type) VALUES ' +
            '($username, $password, $usertype)';
let values;

db.serialize(() => {
  values = {
    $username: 'Roberto Ross',
    $password: 'contra',
    $usertype: 'Administrador'
  }
  db.run(sql, values, function(err) {
    if (err) throw err;

    sql = `SELECT * FROM User WHERE id=${this.lastID}`;
    db.get(sql, (err, user) => {
      console.log(user);
    });
  });
});
