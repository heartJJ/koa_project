const knex = require('../common/knex_connect');
const pagination = require('../middlewares/pagination');
const {parse, write} = require('../middlewares/excel_help');
const _ = require('lodash');

const getVersion = async (ctx, next) => {
  return await knex('version').select().where('project_id', 10000);
};

const getUsers = async (ctx, next) => {
  return {users: await knex('user').select() };
};


const createUser = async (ctx, next) => {
  let data = ctx.body;
  await knex('user').insert(data);
};


const handleFile = async (ctx, next) => {
  let arr = ctx.excel_parse;

  ctx.excel_write = {
    SheetNames: _.map(arr, 'sheetName'),
    Sheets: _.map(arr, 'data'),
    filename: 'aaa'
  };
  return await next();
};


const getPagination = async (ctx, next) => {
  return ctx.pagination;
};

module.exports = router => {

  router.get('/version', getVersion);

  router.get('/user', getUsers);

  router.post('/user', createUser);

  router.post('/file', parse, handleFile, write);

  router.get('/pagination', pagination, getPagination);

  
};
