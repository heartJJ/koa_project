'use strict';
const Knex = require('knex');
const config = require('../config');
const mysql = config.mysql || config;

const knex = Knex({
  client: 'mysql',
  connection: {
    host: mysql.host,
    port: mysql.port||3306,
    user: mysql.username,
    password: mysql.password,
    database: mysql.database
  },
  debug: true,
  useNullAsDefault: true,
  pool: { min: 2, max: 50 }
});

module.exports = knex;
