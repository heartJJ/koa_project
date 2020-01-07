const fs = require('fs'),
  path = require('path');

/**
 * demo 官方示例
 * @param {*} ctx 
 */
const renderHtml = async (ctx) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream(path.resolve(__dirname,  `../views/index${ctx.params.id}.html`) );
};


module.exports = router => {
  router.get('/socket/:id', renderHtml);
};
