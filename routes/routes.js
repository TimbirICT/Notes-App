const express = require('express');

const htmlRouter = require ('./html');
const apiRouter = require ('./api');

const app = express();

app.use('/html' , htmlRouter);

app.use('/api' , apiRouter);

module.exports = app;