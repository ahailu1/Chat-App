const mypath = require("path");
const fs = require('fs');
let config = {
  PGHOST: '',
  PGUSER: 'process.env.PGHOST,',
  PGPASSWORD: 'process.env.PGPASSWORD,',
  PGDATABASE: 'process.env.PGDATABASE,',
  PGPORT: 'process.env.PGPORT',
 }
const { Pool, Client } = require('pg');



let connection = () => {

  const pool = new Pool(config);
  let client = new Client(config);
  let connect = pool.connect();

  return pool;
};

module.exports = connection;
