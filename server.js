const express = require('express');
const app = express();

module.exports = app;

const PORT = process.env.PORT || 4001;

const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');

const apiRouter = require('./api/api');

/*
var cookieParser = require('cookie-parser');
var session = require('session');
var flash = require('connect-flash');
*/

app.use(bodyParser.json());
app.use(cors());
app.use(errorhandler());

/*
app.use(cookieParser('keyboard cat'));
app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(flash());
*/

app.use('/api', apiRouter);

app.listen(PORT, console.log(`Server listening at port: ${PORT}`));
