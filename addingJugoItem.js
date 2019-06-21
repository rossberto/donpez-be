const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

let sql = '';

db.serialize(() => {
  sql = 'ALTER TABLE Price ' +
        'ADD price_jugos INTEGER NOT NULL DEFAULT 8';
  db.run(sql, err => console.log(err));

  sql = 'ALTER TABLE Price ' +
        'ADD cost_jugos INTEGER';
  db.run(sql, err => console.log(err));

  sql = 'ALTER TABLE Purchase ' +
        'ADD jugos INTEGER NOT NULL DEFAULT 0';
  db.run(sql, err => console.log(err));
});
