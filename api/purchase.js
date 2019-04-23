const express = require('express');
const purchaseRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
                                './database.sqlite');

const aux = require('./aux.js');

function calculateTotal(purchase, price) {
  return purchase.tacosPescado * price.price_pescado +
         purchase.tacosCamaron * price.price_camaron +
         purchase.bebidas * price.price_bebidas;
}

purchaseRouter.use('/', aux.getToken, aux.validateToken);

purchaseRouter.post('/', (req, res, next) => {
  const purchase = req.body.purchase;

  let sql = 'SELECT * FROM Price ' +
                    'WHERE id=$priceId';
  db.get(sql, {$priceId: purchase.priceId}, (err, price) => {
    if (err) throw err;

    sql = 'INSERT INTO Purchase ' +
                '(date, tacos_pescado, tacos_camaron, ' +
                'bebidas, total, user_id, price_id) ' +
                'VALUES ($date, $tacosPescado, $tacosCamaron, ' +
                '$bebidas, $total, $userId, $priceId)';
    const values = {
      $date: purchase.date,
      $tacosPescado: purchase.tacosPescado,
      $tacosCamaron: purchase.tacosCamaron,
      $bebidas: purchase.bebidas,
      $total: calculateTotal(purchase, price),
      $userId: req.userId,
      $priceId: purchase.priceId
    };
    db.run(sql, values, function(err) {
      if (err) throw err;

      db.get(`SELECT * FROM Purchase WHERE id=${this.lastID}`, (err, row) => {
        if (err) throw err;

        res.status(201).send(row);
      });
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
  startDate = new Date(range.split('to')[0]);
  endDate = new Date(range.split('to')[1]);
  const start = JSON.stringify(startDate);
  const end = JSON.stringify(endDate);

  const sql = 'SELECT * FROM Purchase ' +
              `WHERE date BETWEEN ${start} AND ${end}`; //LIKE "${startDate}%"`;
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
