const express = require('express');
const purchaseRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

const aux = require('./aux.js');

purchaseRouter.use('/', aux.getToken, aux.validateToken);

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
    $userId: req.userId
  };

  console.log(values.$date);
  //console.log(JSON.parse(values));

  db.run(sql, values, function(err) {
    if (err) throw err;

    db.get(`SELECT * FROM Purchase WHERE id=${this.lastID}`, (err, row) => {
      if (err) throw err;

      res.status(201).send(row);
    });
  });

});

/****************************************/
/*** Next routes require admin access ***/
/****************************************/
purchaseRouter.use('/', aux.validateAdmin);

purchaseRouter.get('/', (req, res, next) => {
  const range = req.headers.range;
  console.log(range);
  startDate = range.split('to')[0];
  console.log(startDate);
  const sql = 'SELECT * FROM Purchase';

  db.all(sql, (err, rows) => {
    if (err) throw err;

    res.status(200).send({sales: rows});
  });
});

purchaseRouter.param('id', (req, res, next, id) => {
  const sql = `SELECT * FROM Purchase WHERE id=${id}`;
  db.get(sql, (err, purchase) => {
    if (err) throw err;

    if (purchase) {
      req.purchaseId = id;
      next();
    } else {
      res.status(404).send();
    }
  });
});

purchaseRouter.delete('/:id', (req, res, next) => {
  const sql = 'DELETE FROM Purchase '+
              'WHERE id=$id';
  db.run(sql,{$id: req.purchaseId}, err => {
    if (err) throw err;

    res.status(204).send();
  });
});

















module.exports = purchaseRouter;
