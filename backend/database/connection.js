const fs = require('fs');
const config = {
  user: 'alexh',
  host: 'ch86kevt1xeu294g',
  database: 'instachatdb',
  password: 'ch86kevt1xeu294g',
  port: 25060,
};

const { Pool, Client } = require('pg');



let connection = () => {

  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'instantchat',
    password: 'm3gn16t5k3jti',
    port: 5432,
  });
  let client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'instantchat',
    password: 'm3gn16t5k3jti',
    port: 5432,
  });
  let connect = pool.connect();

  return pool;
};

module.exports = connection;
