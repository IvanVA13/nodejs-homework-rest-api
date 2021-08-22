const mongoose = require('mongoose');
require('dotenv').config();
const uriDb = process.env.DB_HOST;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on('connected', () =>
  console.log('Database connection successful'),
);

mongoose.connection.on('disconnected', () =>
  console.log('Connection to database terminated'),
);

mongoose.connection.on('error', e => {
  console.log(`Error connection to db: ${e.message}`);
  process.exit(1);
});

process.on('SIGINT', async () => {
  const client = await db;
  client.close();
  process.exit(1);
});

module.exports = db;
