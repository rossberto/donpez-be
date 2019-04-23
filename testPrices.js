const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

const insertSql = 'INSERT INTO Price ' +
            '(date, price_pescado, price_camaron, price_bebidas, user_id) ' +
            'VALUES ' +
            '($date, $pricePescado, $priceCamaron, $priceBebidas, $userId)';
let values;

db.serialize(() => {
  values = {
    $date: '2019-04-18',
    $pricePescado: 20,
    $priceCamaron: 24,
    $priceBebidas: 8,
    $userId: 0
  }
  db.run(insertSql, values, function(err) {
    if (err) throw err;

    const getSql = `SELECT * FROM Price WHERE id=${this.lastID}`;
    db.get(getSql, (err, price) => {
      console.log(price);
    });
  });

  values = {
    $date: '2019-04-22',
    $pricePescado: 22,
    $priceCamaron: 26,
    $priceBebidas: 12,
    $userId: 0
  }
  db.run(insertSql, values, function(err) {
    if (err) throw err;

    const getSql = `SELECT * FROM Price WHERE id=${this.lastID}`;
    db.get(getSql, (err, price) => {
      console.log(price);
    });
  });
});
