const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

let sql;

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS Cashier', (err) => {});

  sql = 'CREATE TABLE Cashier (' +
        'id INTEGER NOT NULL, ' +
        'name TEXT NOT NULL, ' +
        'cel INTEGER NOT NULL' +
        ')';
  db.run(sql, err => {console.log(err);});


  db.run('DROP TABLE IF EXISTS Purchase', err => {});

  sql = 'CREATE TABLE Purchase (' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'date TEXT NOT NULL, ' +
        'tacos_pescado INTEGER NOT NULL, ' +
        'tacos_camaron INTEGER NOT NULL, ' +
        'bebidas INTEGER NOT NULL, ' +
        'cashier_id INTEGER NOT NULL, ' +
        'FOREIGN KEY(cashier_id) REFERENCES Cashier(id)' +
        ')';
  db.run(sql, err => {console.log(err);});
});
