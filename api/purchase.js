const express = require('express');
const purchaseRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

purchaseRouter.post('/', (req, res, next) => {
  const purchase = req.body.purchase;

  const sql = 'INSERT INTO Purchase ' +
              '(date, tacos_pescado, tacos_camaron, ' +
              'bebidas, total, user_id, price_id) ' +
              'VALUES ($date, $tacosPescado, $tacosCamaron, ' +
              '$bebidas, $total, $userId, 123456)';
  const values = {
    $date: purchase.date,
    $tacosPescado: purchase.tacosPescado,
    $tacosCamaron: purchase.tacosCamaron,
    $bebidas: purchase.bebidas,
    $total: purchase.total,
    $userId: 'usuarioforzado'
  };

  db.run(sql, values, function(err) {
    if (err) throw err;

    db.get(`SELECT * FROM Purchase WHERE id=${this.lastID}`, (err, row) => {
      if (err) throw err;

      res.status(201).send(row);
    });
  });

});

purchaseRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Purchase';

  db.all(sql, (err, rows) => {
    if (err) throw err;

    res.status(200).send({sales: rows});
  });
});

module.exports = purchaseRouter;
