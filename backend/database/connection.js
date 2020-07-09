const { Pool, Client } = require('pg');

let connection = () => {

  let client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'm3gn16t5k3jti',
    port: 5432,
  });
  let connect = client.connect();

  return client;
};


module.exports = connection;
