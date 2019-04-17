const express = require('express');
const purchaseRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

purchaseRouter.post('/', (req, res, next) => {
  const purchase = req.body.purchase;

  const sql = 'INSERT INTO Purchase ' +
              '(date, tacos_pescado, tacos_camaron, ' +
              'bebidas, cashier_id, total) ' +
              'VALUES ($date, $tacosPescado, $tacosCamaron, ' +
              '$bebidas, $cashierId, $total)';
  const values = {
    $date: purchase.date,
    $tacosPescado: purchase.tacosPescado,
    $tacosCamaron: purchase.tacosCamaron,
    $bebidas: purchase.bebidas,
    $cashierId: purchase.cashier,
    $total: purchase.total
  };

  db.run(sql, values, function(err) {
    if (err) throw err;

    db.get(`SELECT * FROM Purchase WHERE id=${this.lastID}`, (err, row) => {
      if (err) throw err;

      res.status(201).send({purchase: row});
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
