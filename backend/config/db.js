// /backend/config/db.js

// 1. Import the Pool class from the 'pg' module.
// A connection pool is a cache of database connections maintained so that the
// connections can be reused when future requests to the database are required.
const { Pool } = require('pg');

// 2. Import dotenv to load environment variables from a .env file.
// This is a crucial security practice to keep database credentials out of the source code.
require('dotenv').config();

// 3. Create a new Pool instance.
// The Pool will use the connection information from our environment variables
// to connect to the PostgreSQL database.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 4. Export the query function.
// We are exporting an object with a 'query' method. This allows us to use this
// single pool to run queries from anywhere in our application.
// By centralizing it here, we make our code more modular and easier to manage.
module.exports = {
  query: (text, params) => pool.query(text, params),
};
