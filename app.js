const express = require('express');
const cors = require('cors');
const router = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler.mw');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.use(errorHandler);

module.exports = app;
