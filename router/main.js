const knex = require('../common/knex_connect');
const pagination = require('../middlewares/pagination');
const {parse, write} = require('../middlewares/excel_help');
const _ = require('lodash');

const getHello = async (ctx, next) => {
  return 'hello world';
};

const getUsers = async (ctx, next) => {
  return {users: await knex('test').select() };
};


const createUser = async (ctx, next) => {
  let data = ctx.body;
  await knex('test').insert(data);
};


const handleFile = async (ctx, next) => {
  let arr = ctx.excel_parse;

  ctx.excel_write = {
    SheetNames: _.map(arr, 'sheetName'),
    Sheets: _.map(arr, 'data'),
    filename: 'aaa'
  }
  return await next();
};


const getPagination = async (ctx, next) => {
  return ctx.pagination;
};


module.exports = router => {

  router.get('/', getHello);

  router.get('/user', getUsers);

  router.post('/user', createUser);

  router.post('/file', parse, handleFile, write);

  router.get('/pagination', pagination, getPagination);
}
