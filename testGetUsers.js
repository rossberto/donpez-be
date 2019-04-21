const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

const sql = `SELECT * FROM User WHERE username="cajero"`;
db.get(sql, (err, user) => {
  console.log(user);
  if (err) throw err;
});
