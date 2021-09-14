const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const boolParser = require('express-query-boolean');
const rateLimit = require('express-rate-limit');

const router = require('./routes/api');
const {
  httpCode,
  message,
  statusCode,
  reqLimiterAPI,
} = require('./helpers/constants.js');

require('dotenv').config();
const PUBLIC_FOLDER = process.env.PUBLIC_FOLDER;

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());
app.use(express.static(PUBLIC_FOLDER));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 5000 }));
app.use(boolParser());

app.use('/api', rateLimit(reqLimiterAPI));
app.use('/api', router);

app.use((_, res) => {
  res.status(httpCode.NOT_FOUND).json({ message: message.NOT_FOUND });
});

app.use((err, _, res, __) => {
  const status = err.status || statusCode.INTERNAL_SERVER_ERROR;
  res.status(status).json({ message: err.message });
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;
