const express = require('express');
const cors = require('cors');
const router = require('./src/routes');
const { notFoundHandler, errorHandler } = require('./src/middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

app.use(notFoundHandler); 
app.use(errorHandler);    

module.exports = app;
