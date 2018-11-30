let knex = require('../common/knex_connect');
let knex_trx = {};

//开启kenx事务，需要在后续方法中使用.transacting(req.tr)
knex_trx.openKnexTrans = async (ctx,next)=>{
  return await knex.transaction(async trx => {
    ctx.trx = trx;
    return await next();
  });
};

module.exports = knex_trx;