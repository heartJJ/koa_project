'use strict';
const Knex = require('knex');
const config = require('../config');
const mysql = config.mysql || config;

// console.log(mysql);

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

knex.client.on('query-response', function (response, obj, builder) {
  console.log('-------------------\n', builder.toString());
});

module.exports = knex;
