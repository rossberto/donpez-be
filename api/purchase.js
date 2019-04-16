const express = require('express');
const purchaseRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

purchaseRouter.post('/', (req, res, next) => {
  const purchase = req.body.purchase;

  const sql = 'INSERT INTO Purchase ' +
              '(date, tacos_pescado, tacos_camaron, ' +
              'bebidas, cashier_id) ' +
              'VALUES ($date, $tacosPescado, $tacosCamaron, ' +
              '$bebidas, $cashierId)';
  const values = {
    $date: purchase.date,
    $tacosPescado: purchase.tacosPescado,
    $tacosCamaron: purchase.tacosCamaron,
    $bebidas: purchase.bebidas,
    $cashierId: purchase.cashier
  };

  db.run(sql, values, function(err) {
    if (err) throw err;

    db.get(`SELECT * FROM Purchase WHERE id=${this.lastID}`, (err, row) => {
      if (err) throw err;

      console.log(row);
      res.status(201).send({purchase: row});
    });
  });

});

module.exports = purchaseRouter;
