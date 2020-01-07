'use strict';
const argv = require('yargs').argv;
require('dotenv').config({
  path: argv.env
});
const env = process.env;

module.exports={
  mysql: {
    username: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    dialect: 'mysql',
    timezone: '+08:00',
    pool: {
      maxConnections: env.MYSQL_POOL_MAX,
      minConnections: env.MYSQL_POOL_MIN,
      maxIdleTime: env.MYSQL_IDLETIME
    },
    define: {
      timestamps: false
    },
    logging: console.log,
    dialectOptions: {
      supportBigNumbers: true
    }
  },
  // mongodb: {
  //   uri: `mongodb://${env.MONGO_URI}`,
  //   options: {
  //     poolSize: env.MONGO_POOLSIZE,
  //     autoIndex: false
  //   },
  // },
  // redis: env.REDIS_URL,
  // mail: {
  //   host: env.MAIL_HOST,
  //   port: env.MAIL_PORT,
  //   secure: env.MAIL_SECURE,
  //   auth: {
  //     user: env.MAIL_USER,
  //     pass: env.MAIL_PASS
  //   },
  //   from: `${env.MAIL_NICKNAME}<${env.MAIL_USER}>`,
  //   to: env.MAIL_TO
  // },
  // wx:{
  //   appid: env.WX_APPID,
  //   secret: env.WX_SECRET,
  //   ref_url: env.WX_REFURL,
  //   client_token_url: env.WX_CLIENT_URL
  // },
  uploadDir: env.UPLOAD_DIR,
  // logLocation:env.LOG_DIR,
  // logdir: env.LOG_DIR
};
