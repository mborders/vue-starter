'use strict';

/* Set process name */
process.title = process.argv[2];

const express      = require('express');
const path         = require('path');
const request      = require('request');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser')
const csrf         = require('csurf');
const helmet       = require('helmet');
const app          = express();

let config = require('./config.json');

if (process.env.NODE_ENV === 'production') {
  config = config.production;
} else {
  config = config.dev;
}

/* Secure with Helmet */
app.use(helmet())

/* Parse request bodies as JSON */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Enable simple cookie parsing, add XSRF cookie */
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

/* Handle bad CSRF token */
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  res.status(403).send();
});

/* Server static files */
app.use('/static', express.static(__dirname + '/../dist/static'));

/* Load API routes */
require('../server/routes/api')(app);

/* Serve index.html on all other routes */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../dist/index.html'));
});

/* Start listening */
app.listen(config.port, () => {
  console.log(`Server listening on ${config.port}`);
});
