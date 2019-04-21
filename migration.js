const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

let sql;

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS User', (err) => {});
  sql = 'CREATE TABLE User (' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'username TEXT NOT NULL, ' +
        'password TEXT NOT NULL, ' +
        'user_type TEXT NOT NULL, ' +
        'is_active INTEGER DEFAULT 1 NOT NULL, ' +
        'name TEXT, ' +
        'cel INTEGER, ' +
        'email TEXT' +
        ')';
  db.run(sql, err => {console.log(err);});

  db.run('DROP TABLE IF EXISTS AccessLog', err => {});
  sql = 'CREATE TABLE AccessLog (' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'login_date TEXT NOT NULL, ' +
        'logout_date TEXT, ' +
        'access_type TEXT NOT NULL, ' +
        'token TEXT NOT NULL, ' +
        'active_session INTEGER NOT NULL DEFAULT 1, ' +
        'user_id TEXT NOT NULL, ' +
        'FOREIGN KEY(user_id) REFERENCES User(id)' +
        ')';
  db.run(sql, err => {console.log(err);});

  db.run('DROP TABLE IF EXISTS Price', (err) => {});
  sql = 'CREATE TABLE Price (' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'date TEXT NOT NULL, ' +
        'precio_pescado INTEGER NOT NULL, ' +
        'precio_camaron INTEGER NOT NULL, ' +
        'precio_bebidas INTEGER NOT NULL, ' +
        'costo_pescado INTEGER, ' +
        'costo_camaron INTEGER, ' +
        'costo_bebidas INTEGER, ' +
        'user_id INTEGER NOT NULL, ' +
        'FOREIGN KEY(user_id) REFERENCES User(id)' +
        ')';
  db.run(sql, err => {console.log(err);});


  db.run('DROP TABLE IF EXISTS Purchase', err => {});
  sql = 'CREATE TABLE Purchase (' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'date TEXT NOT NULL, ' +
        'tacos_pescado INTEGER NOT NULL, ' +
        'tacos_camaron INTEGER NOT NULL, ' +
        'bebidas INTEGER NOT NULL, ' +
        'total INTEGER NOT NULL, ' +
        'price_id INTEGER NOT NULL, ' +
        'user_id INTEGER NOT NULL, ' +
        'FOREIGN KEY(price_id) REFERENCES Price(id), ' +
        'FOREIGN KEY(user_id) REFERENCES User(id)' +
        ')';
  db.run(sql, err => {console.log(err);});

  db.run('DROP TABLE IF EXISTS DaySummary', err => {});
  sql = 'CREATE TABLE DaySummary (' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'date TEXT NOT NULL, ' +
        'tacos_pescado INTEGER NOT NULL, ' +
        'tacos_camaron INTEGER NOT NULL, ' +
        'bebidas INTEGER NOT NULL, ' +
        'total INTEGER NOT NULL, ' +
        'transactions INTEGER NOT NULL, ' +
        'avg_sale INTEGER NOT NULL' +
        ')';
  db.run(sql, err => {console.log(err);});
});
