const fs = require('fs'),
  path = require('path');
const redis = require('../common/redis_connect');

/**
 * demo 官方示例
 * @param {*} ctx 
 */
const renderHtml = async (ctx) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream(path.resolve(__dirname,  `../views/index${ctx.params.id}.html`) );
};

const emitMsg = async (ctx) => {
  const id = ctx.params.id;

  const socketId = await redis.get(`client-${id}`);

  if (!socketId) {
    throw new Error('未找到客户端');
  }

  const sockets = await ctx.io.of('/').fetchSockets(),
    socket = sockets.find(v => v.id === socketId);
  
  // const example1 = await ctx.io.of('/example1').fetchSockets();
  
  socket.emit('chat message', '这是一条公共的消息');
};


module.exports = router => {
  router.get('/socket/:id', renderHtml);

  router.get('/socket/:id/msg', emitMsg);
};
